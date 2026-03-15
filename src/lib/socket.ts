import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (token: string): Socket => {
  if (socket?.connected) {
    return socket;
  }

  const SOCKET_URL = process.env.SOCKET_BASE_URL || 'https://thru-gain-interval-bids.trycloudflare.com';

  console.log('🔌 Connecting to socket:', SOCKET_URL);
  console.log('🔑 Token:', token ? `${token.substring(0, 20)}...` : 'No token');

  // Remove 'Bearer ' prefix if present - server expects raw JWT token
  const rawToken = token.startsWith('Bearer ') ? token.substring(7) : token;

  socket = io(SOCKET_URL, {
    // Send token in auth object - standard socket.io way
    auth: {
      token: rawToken,
    },
    // Also send as query parameter for compatibility
    query: {
      token: rawToken,
    },
    // Use polling first to support headers, then upgrade to websocket
    transports: ['polling', 'websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    // Force new connection to avoid cached connections
    forceNew: true,
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error.message);
    console.error('Error details:', error);
  });

  socket.on('error', (error) => {
    console.error('❌ Socket error:', error.message);
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};

export const emitEvent = (eventName: string, data: any): void => {
  if (socket?.connected) {
    console.log('📤 Emitting event:', eventName, data);
    socket.emit(eventName, data);
  } else {
    console.warn('⚠️ Socket not connected, cannot emit:', eventName);
  }
};

export const onEvent = (eventName: string, callback: (data: any) => void): void => {
  if (socket) {
    socket.on(eventName, callback);
    console.log('📡 Listening for event:', eventName);
  }
};

export const offEvent = (eventName: string, callback?: (data: any) => void): void => {
  if (socket) {
    socket.off(eventName, callback);
    console.log('🔇 Stopped listening for event:', eventName);
  }
};
