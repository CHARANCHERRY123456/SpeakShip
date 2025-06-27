// src/features/feedback/repositories/FeedbackRepository.js
import Feedback from '../models/Feedback.js';

const FeedbackRepository = {
  async create({ deliveryId, customerId, driverId, rating, comment }) {
    const feedback = new Feedback({ deliveryId, customerId, driverId, rating, comment });
    return feedback.save();
  },
  async findByDelivery(deliveryId) {
    return Feedback.find({ deliveryId }).sort({ createdAt: -1 });
  },
  async findByDeliveryAndCustomer(deliveryId, customerId) {
    return Feedback.findOne({ deliveryId, customerId });
  },
  async findAll() {
    return Feedback.find({}).sort({ createdAt: -1 });
  },
  async findByDriver(driverId) {
    return Feedback.find({ driverId }).sort({ createdAt: -1 });
  }
};

export default FeedbackRepository;
