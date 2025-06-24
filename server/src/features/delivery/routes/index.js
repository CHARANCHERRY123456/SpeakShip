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

// NEW ROUTE: Update delivery status (driver or customer)
router.patch('/status/:id', authenticate(['driver', 'customer']), DeliveryController.updateStatus);


// OTP verification (customer or driver)
router.post('/verify-otp/:id', authenticate(['customer', 'driver']), DeliveryController.verifyDeliveryOtp);

// Get a delivery by ID (customer or driver)
router.get('/:id', authenticate(['customer', 'driver']), DeliveryController.getById);

export default router;
