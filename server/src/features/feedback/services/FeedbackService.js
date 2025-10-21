import FeedbackRepository from '../repositories/FeedbackRepository.js';
import { FEEDBACK_ERRORS } from '../../../constants/globalConstants.js';

const FeedbackService = {
  async createFeedback({ deliveryId, customerId, driverId, rating, comment }) {
    const existing = await FeedbackRepository.findByDeliveryAndCustomer(deliveryId, customerId);
    if (existing) throw new Error(FEEDBACK_ERRORS.DUPLICATE_REVIEW);
    return FeedbackRepository.create({ deliveryId, customerId, driverId, rating, comment });
  },
  async getFeedbackForDelivery(deliveryId) {
    return FeedbackRepository.findByDelivery(deliveryId);
  },
  async getFeedbackByCustomer(deliveryId, customerId) {
    return FeedbackRepository.findByDeliveryAndCustomer(deliveryId, customerId);
  },
  async getAllFeedback() {
    return FeedbackRepository.findAll();
  },
  async getFeedbackForDriver(driverId) {
    return FeedbackRepository.findByDriver(driverId);
  },
  async getFeedbackForUser(userId) {
    return FeedbackRepository.findByUser(userId);
  }
};

export default FeedbackService;
