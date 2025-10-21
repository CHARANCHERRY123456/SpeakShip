import { findChatByDelivery,createChat} from '../repositories/chat.repository.js';

import { createMessage,getMessagesByChat} from '../repositories/message.repository.js';

export const getOrCreateChat = async (deliveryOrderId, customerId, driverId) => {
  let chat = await findChatByDelivery(deliveryOrderId);

  if (!chat) {
    const participants = [
      { userId: customerId, role: 'customer' },
      { userId: driverId, role: 'driver' }
    ];
    chat = await createChat(participants, deliveryOrderId);
  }

  return chat;
};

export const sendMessage = async (chatId, senderId, content, senderRole, senderName) => {
  return await createMessage({
    chat: chatId,
    senderId,
    senderRole,
    senderName, 
    content,
  });
};

export const fetchMessages = async (chatId) => {
  return await getMessagesByChat(chatId);
};
