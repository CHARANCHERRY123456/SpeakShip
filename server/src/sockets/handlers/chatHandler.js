import { sendMessage } from '../../features/chat/services/chat.service.js';

export default function chatHandler(socket, io) {
  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`✅ Joined chat room: ${chatId}`);
  });

  socket.on('sendMessage', async ({ chatId, senderId, content, senderRole }) => {
    console.log('🟢 [server] Received sendMessage event:', {
      chatId,
      senderId,
      content,
      senderRole
    });
    try {
      // Use chat.service to handle message creation and population
      const message = await sendMessage(chatId, senderId, content, senderRole, { populate: true });
      console.log('📩 [server] New incoming message (populated):', message);
      const outgoing = {
        ...message,
        sender: message.senderId,
      };
      console.log('📤 [server] Emitting newMessage event to room:', chatId, 'with data:', outgoing);
      io.to(chatId).emit('newMessage', outgoing);
      console.log('✅ [server] newMessage event emitted');
    } catch (err) {
      console.error('❌ Error sending message:', err);
    }
  });

  socket.on('leaveChat', (chatId) => {
    socket.leave(chatId);
    console.log(`🚪 Left chat room: ${chatId}`);
  });

  socket.on('hello', (data) => {
    console.log('👋 [server] Received hello event with data:', data);
    socket.emit('helloResponse', { message: 'Hello from Socket.IO server!', received: data });
  });
}
