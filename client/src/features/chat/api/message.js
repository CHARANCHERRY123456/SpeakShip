// client/src/features/chat/api/message.js
import axios from '../../../api/axios';

export const getMessagesForChat = async (chatId) => {
  const { data } = await axios.get(`/api/chat/${chatId}/messages`);

  return data;
};
