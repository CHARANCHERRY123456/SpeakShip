import Chat from '../schemas/chat.model.js';

export const findChatByDelivery = (deliveryOrderId) =>
  Chat.findOne({ deliveryOrderId });

export const createChat = (participants, deliveryOrderId) =>
  Chat.create({ participants, deliveryOrderId });
