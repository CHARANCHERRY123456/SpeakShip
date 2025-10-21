import express from 'express';
import FeedbackController from './controllers/FeedbackController.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = express.Router();

router.post('/', authenticate(['customer']), FeedbackController.submitFeedback);
router.get('/', authenticate(['admin']), FeedbackController.getAllFeedback);
router.get('/delivery/:deliveryId', authenticate(['customer', 'driver']), FeedbackController.getFeedbackForDelivery);
router.get('/delivery/:deliveryId/customer/:customerId', authenticate(['customer', 'admin']), FeedbackController.getFeedbackByCustomer);
router.get('/delivery/:deliveryId/me', authenticate(['customer']), (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  FeedbackController.getFeedbackByCustomer({
    ...req,
    params: { deliveryId: req.params.deliveryId, customerId: req.user.id }
  }, res);
});
router.get('/driver/:driverId', authenticate(['driver', 'admin']), FeedbackController.getFeedbackForDriver);
router.get('/user/:userId', authenticate(['customer', 'driver', 'admin']), FeedbackController.getFeedbackForUser);

export default router;
