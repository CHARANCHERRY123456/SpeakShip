import Feedback from '../models/Feedback.js';

const FEEDBACK_POPULATE = [
  {
    path: 'driverId',
    select: 'name photoUrl role',
    model: 'Driver'
  },
  {
    path: 'customerId',
    select: 'name photoUrl role',
    model: 'Customer'
  }
];

const FeedbackRepository = {
  async create({ deliveryId, customerId, driverId, rating, comment }) {
    const feedback = new Feedback({ deliveryId, customerId, driverId, rating, comment });
    return feedback.save();
  },
  async findByDelivery(deliveryId) {
    return Feedback.find({ deliveryId })
      .sort({ createdAt: -1 })
      .populate(FEEDBACK_POPULATE);
  },
  async findByDeliveryAndCustomer(deliveryId, customerId) {
    return Feedback.findOne({ deliveryId, customerId })
      .populate(FEEDBACK_POPULATE);
  },
  async findAll() {
    return Feedback.find({})
      .sort({ createdAt: -1 })
      .populate(FEEDBACK_POPULATE);
  },
  async findByDriver(driverId) {
    return Feedback.find({ driverId })
      .sort({ createdAt: -1 })
      .populate(FEEDBACK_POPULATE);
  },
  async findByUser(userId) {
    return Feedback.find({ $or: [ { customerId: userId }, { driverId: userId } ] })
      .sort({ createdAt: -1 })
      .populate(FEEDBACK_POPULATE);
  }
};

export default FeedbackRepository;
