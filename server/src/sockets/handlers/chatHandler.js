import { sendMessage } from '../../features/chat/services/chat.service.js';

export default function chatHandler(socket, io) {
  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
  });

  socket.on('sendMessage', async ({ chatId, senderId, content, senderRole }) => {
    try {
      // Derive senderName based on role, or set fallback
      let senderName = 'Unknown';

      if (senderRole === 'customer') {
        senderName = 'Customer';
      } else if (senderRole === 'driver') {
        senderName = 'Driver';
      }

      // Call your service with correct senderName as a string
      const message = await sendMessage(chatId, senderId, content, senderRole, senderName);

      const plainMessage = message.toObject ? message.toObject() : message;
      io.to(chatId).emit('newMessage', plainMessage);
    } catch (err) {
      console.error('❌ Error sending message:', err);
    }
  });

  socket.on('leaveChat', (chatId) => {
    socket.leave(chatId);
  });

  socket.on('hello', (data) => {
    socket.emit('helloResponse', { message: 'Hello from Socket.IO server!', received: data });
  });
}
