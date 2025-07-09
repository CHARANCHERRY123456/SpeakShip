import {
  findChatByDelivery,
  createChat
} from '../repositories/chat.repository.js';

import {
  createMessage,
  getMessagesByChat
} from '../repositories/message.repository.js';

/**
 * Returns existing chat or creates one between customer and driver.
 */
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

/**
 * Saves a message to a chat.
 */
export const sendMessage = async (chatId, senderId, content, senderRole) => {
  return await createMessage({
    chat: chatId,
    senderId, // <-- Correct field name for schema
    senderRole,
    content,
  });
};

/**
 * Retrieves all messages for a chat.
 */
export const fetchMessages = async (chatId) => {
  return await getMessagesByChat(chatId);
};
