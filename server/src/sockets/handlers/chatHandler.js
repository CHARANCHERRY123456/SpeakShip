import { sendMessage } from '../../features/chat/services/chat.service.js';

export default function chatHandler(socket, io) {
  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`✅ Joined chat room: ${chatId}`);
  });

  socket.on('sendMessage', async ({ chatId, senderId, content, senderRole }) => {
    try {
      const message = await sendMessage(chatId, senderId, content, senderRole);

      console.log('📩 New incoming message:', message);

      // Send to all in room
      io.to(chatId).emit('newMessage', message);
    } catch (err) {
      console.error('❌ Error sending message:', err.message);
    }
  });

  socket.on('leaveChat', (chatId) => {
    socket.leave(chatId);
    console.log(`🚪 Left chat room: ${chatId}`);
  });
}
