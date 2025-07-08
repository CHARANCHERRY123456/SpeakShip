//server/src/features/chat/repositories/message.repository.js
import Message from '../schemas/message.model.js';

export const createMessage = (data) => Message.create(data);

export const getMessagesByChat = (chatId) =>
  Message.find({ chat: chatId }).sort('createdAt');
