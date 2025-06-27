// src/features/feedback/routes.js
import express from 'express';
import FeedbackController from './controllers/FeedbackController.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = express.Router();

// POST /api/feedback
router.post('/', authenticate(['customer']), FeedbackController.submitFeedback);
// GET /api/feedback (admin or for viewing all feedback)
router.get('/', authenticate(['admin']), FeedbackController.getAllFeedback);
// Add missing delivery-specific feedback routes
router.get('/delivery/:deliveryId', authenticate(['customer', 'driver']), FeedbackController.getFeedbackForDelivery);
router.get('/delivery/:deliveryId/customer/:customerId', authenticate(['customer', 'admin']), FeedbackController.getFeedbackByCustomer);
// Add route for current user's review for a delivery
router.get('/delivery/:deliveryId/me', authenticate(['customer']), (req, res) => {
  // Assumes authentication middleware sets req.user
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  FeedbackController.getFeedbackByCustomer({
    ...req,
    params: { deliveryId: req.params.deliveryId, customerId: req.user.id }
  }, res);
});
// Get all reviews for a driver
router.get('/driver/:driverId', authenticate(['driver', 'admin']), FeedbackController.getFeedbackForDriver);

export default router;
