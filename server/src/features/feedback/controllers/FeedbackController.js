// src/features/feedback/controllers/FeedbackController.js
import FeedbackService from '../services/FeedbackService.js';
import { FEEDBACK_ERRORS } from '../../../constants/globalConstants.js';

const FeedbackController = {
  submitFeedback: async (req, res) => {
    try {
      const { deliveryId, rating, comment } = req.body;
      const customerId = req.user.id; // Assumes authentication middleware sets req.user
      const driverId = req.body.driverId; // Optionally, can be fetched from delivery
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
  }
};

export default FeedbackController;
