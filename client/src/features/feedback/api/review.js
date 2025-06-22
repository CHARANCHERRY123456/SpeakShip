// src/features/feedback/api/review.js
import axios from '../../../api/axios';

export async function submitReview({ deliveryId, rating, comment }) {
  const res = await axios.post('/api/feedback', { deliveryId, rating, comment });
  return res.data;
}

export async function getReviewsForDelivery(deliveryId) {
  const res = await axios.get(`/api/feedback/delivery/${deliveryId}`);
  return res.data;
}

export async function getMyReviewForDelivery(deliveryId) {
  const res = await axios.get(`/api/feedback/delivery/${deliveryId}/me`);
  return res.data;
}
