import { useEffect } from 'react';
import { io } from 'socket.io-client';

export default function SocketTest() {
  useEffect(() => {
    // Connect to backend socket server
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      withCredentials: true,
    });
    socket.on('connect', () => {
      console.log('🟢 [client] Socket connected:', socket.id);
      // Emit hello event after connection
      socket.emit('hello', { test: 'ping from client' });
      console.log('📤 [client] Emitted hello event');
    });
    socket.on('helloResponse', (data) => {
      console.log('✅ [client] Received helloResponse:', data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  return null;
}