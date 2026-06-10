import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { JwtTokenService } from '../../infrastructure/security/jwt-token-service';
import { env } from '../../infrastructure/config/env';
import { winstonLogger } from '../../infrastructure/config/logger';
import { sendMessageUseCase, resetUnreadCountUseCase } from '../../infrastructure/di/chatDi';
import { socketService } from '../../infrastructure/services/socket.service';

interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    email: string;
    roles: string[];
  };
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const key = parts.shift()?.trim();
    if (key) {
      list[key] = decodeURIComponent(parts.join('='));
    }
  });

  return list;
}

export function initSocketServer(httpServer: HttpServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  socketService.setIo(io);

  const tokenService = new JwtTokenService();

  io.use((socket: AuthenticatedSocket, next) => {
    try {
      const cookies = parseCookies(socket.handshake.headers.cookie);
      const token = cookies[env.COOKIE_NAME_ACCESS];

      if (!token) {
        return next(new Error('Authentication error: Access token missing'));
      }

      const payload = tokenService.verifyAccess(token);
      socket.user = {
        id: payload.sub,
        email: payload.email || '',
        roles: payload.roles || [],
      };
      
      next();
    } catch (error) {
      winstonLogger.error('Socket authentication failed:', error);
      next(new Error('Authentication error: Invalid access token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.user?.id;
    winstonLogger.info(`Socket client connected: ${socket.id} (User: ${userId})`);

    if (userId) {
      // Join a personal room to receive real-time notifications/updates
      socket.join(`user_${userId}`);
    }

    // Join conversation room
    socket.on('join_conversation', (data: { conversationId: string }) => {
      const { conversationId } = data;
      if (!conversationId) return;

      socket.join(`chat_${conversationId}`);
      winstonLogger.info(`Socket ${socket.id} joined chat_${conversationId}`);
    });

    // Leave conversation room
    socket.on('leave_conversation', (data: { conversationId: string }) => {
      const { conversationId } = data;
      if (!conversationId) return;

      socket.leave(`chat_${conversationId}`);
      winstonLogger.info(`Socket ${socket.id} left chat_${conversationId}`);
    });

    // Send message event
    socket.on(
      'send_message',
      async (
        data: { conversationId: string; text?: string; attachmentUrl?: string | null },
        callback?: (response: { success: boolean; data?: unknown; error?: string }) => void
      ) => {
        try {
          const { conversationId, text, attachmentUrl } = data;
          if (!conversationId || (!text && !attachmentUrl)) {
            callback?.({ success: false, error: 'conversationId and either text or attachmentUrl are required' });
            return;
          }

          if (!userId) {
            callback?.({ success: false, error: 'User context not found' });
            return;
          }

          const message = await sendMessageUseCase.execute(
            userId,
            conversationId,
            text ?? "",
            attachmentUrl
          );

          // Broadcast message to conversation room
          io.to(`chat_${conversationId}`).emit('message_received', message);

          // Broadcast notification to both users to update last message and unread count
          io.emit('conversation_updated', { conversationId });

          callback?.({ success: true, data: message });
        } catch (error) {
          winstonLogger.error('Error handling socket send_message:', error);
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          callback?.({ success: false, error: errorMsg });
        }
      }
    );

    // Read messages event (reset unread count)
    socket.on(
      'read_messages',
      async (data: { conversationId: string; role: 'client' | 'provider' }) => {
        try {
          const { conversationId, role } = data;
          if (!conversationId || !role) return;

          await resetUnreadCountUseCase.execute(conversationId, role);
          
          // Emit event back to conversation room to notify that messages are read
          io.to(`chat_${conversationId}`).emit('messages_read', { conversationId, role });
          io.emit('conversation_updated', { conversationId });
        } catch (error) {
          winstonLogger.error('Error handling socket read_messages:', error);
        }
      }
    );

    socket.on('disconnect', () => {
      winstonLogger.info(`Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
}
