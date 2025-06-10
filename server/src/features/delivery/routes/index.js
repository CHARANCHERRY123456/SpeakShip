import express from 'express';
import DeliveryController from '../controllers/DeliveryController.js';
import { authenticate } from '../../../middleware/authenticate.js';
import upload from '../../../middleware/upload.js';

const router = express.Router();

// Create delivery request (customer)
router.post('/create', authenticate(['customer']), upload.single('photo'), DeliveryController.createRequest);

// List all pending requests (driver)
router.get('/pending', authenticate(['driver']), DeliveryController.listPending);

// Accept a request (driver)
router.post('/accept/:id', authenticate(['driver']), DeliveryController.acceptRequest);

// List deliveries for driver
router.get('/my', authenticate(['driver']), DeliveryController.listForDriver);

// List deliveries for customer
router.get('/customer', authenticate(['customer']), DeliveryController.listForCustomer);

export default router;
