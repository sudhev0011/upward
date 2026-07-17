import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_ENV == 'production' ? import.meta.env.VITE_SOCKET_URL : import.meta.env.VITE_API_URL

let globalSocket: Socket | null = null;

// Helper to ensure socket is instantiated lazily when needed
const getOrCreateSocket = (): Socket => {
  if (!globalSocket) {
    globalSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket'],
    });
  }
  return globalSocket;
};

export const useSocket = (conversationId?: string) => {
  // 1. Initialize state directly using the singleton value or initializer function
  // This avoids running setSocket/setIsConnected synchronously inside useEffect
  const [socket] = useState<Socket>(getOrCreateSocket);
  const [isConnected, setIsConnected] = useState(() => globalSocket?.connected ?? false);

  useEffect(() => {
    // globalSocket is guaranteed to exist now because of the initializer
    const currentSocket = globalSocket!; 

    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    currentSocket.on('connect', onConnect);
    currentSocket.on('disconnect', onDisconnect);

    // Join conversation logic
    if (conversationId) {
      if (currentSocket.connected) {
        currentSocket.emit('join_conversation', { conversationId });
      } else {
        currentSocket.once('connect', () => {
          currentSocket.emit('join_conversation', { conversationId });
        });
      }
    }

    return () => {
      currentSocket.off('connect', onConnect);
      currentSocket.off('disconnect', onDisconnect);

      if (conversationId) {
        currentSocket.emit('leave_conversation', { conversationId });
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