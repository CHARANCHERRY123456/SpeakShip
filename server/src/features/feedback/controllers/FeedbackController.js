import FeedbackService from '../services/FeedbackService.js';
import { FEEDBACK_ERRORS } from '../../../constants/globalConstants.js';

const FeedbackController = {
  submitFeedback: async (req, res) => {
    try {
      const { deliveryId, rating, comment } = req.body;
      const customerId = req.user.id; 
      const driverId = req.body.driverId;
      if (!deliveryId || !rating || !comment) {
        return res.status(400).json({ error: FEEDBACK_ERRORS.MISSING_FIELDS });
      }
      const feedback = await FeedbackService.createFeedback({ deliveryId, customerId, driverId, rating, comment });
      res.status(201).json(feedback);
    } catch (err) {
      if (err.message === FEEDBACK_ERRORS.DUPLICATE_REVIEW) {
        return res.status(409).json({ error: FEEDBACK_ERRORS.DUPLICATE_REVIEW });
      }
      res.status(500).json({ error: err.message });
    }
  },
  getFeedbackForDelivery: async (req, res) => {
    try {
      const { deliveryId } = req.params;
      const feedbacks = await FeedbackService.getFeedbackForDelivery(deliveryId);
      res.json(feedbacks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getFeedbackByCustomer: async (req, res) => {
    try {
      const { deliveryId, customerId } = req.params;
      const feedback = await FeedbackService.getFeedbackByCustomer(deliveryId, customerId);
      res.json(feedback);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getAllFeedback: async (req, res) => {
    try {
      const feedbacks = await FeedbackService.getAllFeedback();
      res.json(feedbacks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getFeedbackForDriver: async (req, res) => {
    try {
      const { driverId } = req.params;
      const feedbacks = await FeedbackService.getFeedbackForDriver(driverId);
      res.json(feedbacks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getFeedbackForUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const feedbacks = await FeedbackService.getFeedbackForUser(userId);
      res.json(feedbacks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default FeedbackController;
