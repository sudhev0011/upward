import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

let globalSocket: Socket | null = null;

export const useSocket = (conversationId?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(globalSocket);

  useEffect(() => {
    if (!globalSocket) {
      globalSocket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket'],
      });
    }

    setSocket(globalSocket);
    setIsConnected(globalSocket.connected);

    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    globalSocket.on('connect', onConnect);
    globalSocket.on('disconnect', onDisconnect);

    if (conversationId && globalSocket.connected) {
      globalSocket.emit('join_conversation', { conversationId });
    } else if (conversationId) {
      const joinOnConnect = () => {
        globalSocket?.emit('join_conversation', { conversationId });
      };
      globalSocket.once('connect', joinOnConnect);
    }

    return () => {
      if (globalSocket) {
        globalSocket.off('connect', onConnect);
        globalSocket.off('disconnect', onDisconnect);

        if (conversationId) {
          globalSocket.emit('leave_conversation', { conversationId });
        }
      }
    };
  }, [conversationId]);

  return {
    socket,
    isConnected,
  };
};

export const disconnectSocket = () => {
  if (globalSocket) {
    globalSocket.disconnect();
    globalSocket = null;
  }
};
