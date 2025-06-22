// src/features/feedback/api/index.js
import axios from '../../../api/axios';

export async function submitFeedback({ name, email, message }) {
  const res = await axios.post('/api/feedback', { name, email, message });
  return res.data;
}
