import { AuthenticatedSocket, SocketCallback } from "../types/socket.types";
import { SocketEvents } from "../events/socket-events";
import { ISendMessageUseCase } from "../../../domain/interfaces/usecases/chat/ISendMessageUseCase";
import { ISocketService } from "../../../domain/interfaces/services/ISocketService";
import { getUserId, handleSocketError } from "../utils/socket.utils";
import { IDeleteMessageUseCase } from "../../../domain/interfaces/usecases/chat/IDeleteMessageUseCase";
import { IAddMessageReactionUseCase } from "../../../domain/interfaces/usecases/chat/IAddMessageReactionUseCase";
import { IResetUnreadCountUseCase } from "../../../domain/interfaces/usecases/chat/IResetUnreadCountUseCase";
import { ILogger } from "../../../domain/interfaces/services/ILogger";

export class ChatEventsHandler {
  constructor(
    private readonly socketService: ISocketService,
    private readonly sendMessageUseCase: ISendMessageUseCase,
    private readonly deleteMessageUseCase: IDeleteMessageUseCase,
    private readonly addMessageReactionUseCase: IAddMessageReactionUseCase,
    private readonly resetUnreadCountUseCase: IResetUnreadCountUseCase,
    private readonly logger: ILogger,
  ) {}

  register(socket: AuthenticatedSocket) {
    socket.on(SocketEvents.JOIN_CONVERSATION, (data) =>
      this.joinConversation(socket, data),
    );

    socket.on(SocketEvents.LEAVE_CONVERSATION, (data) =>
      this.leaveConversation(socket, data),
    );

    socket.on(SocketEvents.SEND_MESSAGE, (data, callback) =>
      this.sendMessage(socket, data, callback),
    );

    socket.on(SocketEvents.DELETE_MESSAGE, (data, callback) =>
      this.deleteMessage(socket, data, callback),
    );

    socket.on(SocketEvents.SEND_MESSAGE_REACTION, (data, callback) =>
      this.sendReaction(socket, data, callback),
    );

    socket.on(SocketEvents.READ_MESSAGES, (data) =>
      this.readMessages(socket, data),
    );

    socket.on(SocketEvents.DISCONNECT, () => this.disconnect(socket));
  }

  private joinConversation(
    socket: AuthenticatedSocket,
    data: {
      conversationId: string;
    },
  ) {
    const { conversationId } = data;

    if (!conversationId) {
      return;
    }

    socket.join(`chat_${conversationId}`);
  }

  private leaveConversation(
    socket: AuthenticatedSocket,
    data: {
      conversationId: string;
    },
  ) {
    const { conversationId } = data;

    if (!conversationId) {
      return;
    }

    socket.leave(`chat_${conversationId}`);
  }

  private async sendMessage(
    socket: AuthenticatedSocket,
    data: {
      conversationId: string;
      text?: string;
      attachmentUrl?: string | null;
    },
    callback?: SocketCallback,
  ) {
    try {
      const { conversationId, text, attachmentUrl } = data;

      if (!conversationId || (!text && !attachmentUrl)) {
        callback?.({
          success: false,
          error: "conversationId and either text or attachmentUrl are required",
        });
        return;
      }

      const userId = getUserId(socket);

      const result = await this.sendMessageUseCase.execute(
        userId,
        conversationId,
        text ?? "",
        attachmentUrl,
      );

      this.socketService.emitToRoom(
        `chat_${conversationId}`,
        SocketEvents.MESSAGE_RECEIVED,
        result.message,
      );

      this.socketService.emitToUser(userId, SocketEvents.CONVERSATION_UPDATED, {
        conversationId,
      });

      this.socketService.emitToUser(
        result.recipientId,
        SocketEvents.CONVERSATION_UPDATED,
        {
          conversationId,
        },
      );

      callback?.({
        success: true,
        data: result.message,
      });
    } catch (error) {
      handleSocketError(error, callback);
    }
  }

  private async sendReaction(
    socket: AuthenticatedSocket,
    data: {
      messageId: string;
      reaction: string;
    },
    callback?: SocketCallback,
  ) {
    try {
      const { messageId, reaction } = data;

      if (!messageId || !reaction) {
        callback?.({
          success: false,
          error: "messageId and reaction are required",
        });
        return;
      }

      const userId = getUserId(socket);

      const result = await this.addMessageReactionUseCase.execute(
        messageId,
        userId,
        reaction,
      );

      const conversationId = result.message.conversationId;

      this.socketService.emitToRoom(
        `chat_${conversationId}`,
        SocketEvents.MESSAGE_REACTION_UPDATED,
        {
          messageId,
          userId,
          reaction,
          conversationId,
        },
      );

      callback?.({
        success: true,
      });
    } catch (error) {
      handleSocketError(error, callback);
    }
  }

  private async deleteMessage(
    socket: AuthenticatedSocket,
    data: {
      messageId: string;
    },
    callback?: SocketCallback,
  ) {
    try {
      const { messageId } = data;

      if (!messageId) {
        callback?.({
          success: false,
          error: "messageId and conversationId are required",
        });
        return;
      }

      const userId = getUserId(socket);

      const result = await this.deleteMessageUseCase.execute(userId, messageId);

      const conversationId = result.message.conversationId;

      this.socketService.emitToRoom(
        `chat_${conversationId}`,
        SocketEvents.MESSAGE_DELETED,
        {
          messageId,
          userId,
          conversationId,
        },
      );

      this.socketService.emitToUser(userId, SocketEvents.CONVERSATION_UPDATED, {
        conversationId,
      });

      this.socketService.emitToUser(
        result.recipientId,
        SocketEvents.CONVERSATION_UPDATED,
        {
          conversationId,
        },
      );

      callback?.({
        success: true,
      });
    } catch (error) {
      handleSocketError(error, callback);
    }
  }

  private async readMessages(
    socket: AuthenticatedSocket,
    data: {
      conversationId: string;
    },
  ) {
    try {
      const { conversationId } = data;

      if (!conversationId) {
        return;
      }

      const userId = getUserId(socket);

      await this.resetUnreadCountUseCase.execute(conversationId, userId);

      this.socketService.emitToRoom(
        `chat_${conversationId}`,
        SocketEvents.MESSAGES_READ,
        {
          conversationId,
          userId,
        },
      );

      this.socketService.emitToUser(userId, SocketEvents.CONVERSATION_UPDATED, {
        conversationId,
      });
    } catch (error) {
      handleSocketError(error);
    }
  }

  private disconnect(socket: AuthenticatedSocket) {
    this.logger.info(
      `Socket client disconnected: ${socket.id} (User: ${socket.user?.id})`,
    );
  }
}
