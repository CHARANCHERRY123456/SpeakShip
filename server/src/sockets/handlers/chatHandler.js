import { sendMessage } from '../../features/chat/services/chat.service.js';

export default function chatHandler(socket, io) {
  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
  });

  socket.on('sendMessage', async ({ chatId, senderId, content, senderRole }) => {
    try {
      // Use chat.service to handle message creation and population
      const message = await sendMessage(chatId, senderId, content, senderRole, { populate: true });
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
