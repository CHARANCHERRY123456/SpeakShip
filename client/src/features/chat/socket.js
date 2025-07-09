import { io } from 'socket.io-client';

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000', {
      withCredentials: true,
      transports: ['websocket'],
    });
  }
  return socket;
};
