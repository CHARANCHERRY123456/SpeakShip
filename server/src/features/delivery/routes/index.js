import express from 'express';
import DeliveryController from '../controllers/DeliveryController.js';
// import multer from 'multer'; // Uncomment and configure if you want file uploads
// const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Create delivery request (customer)
// router.post('/create', upload.single('photo'), DeliveryController.createRequest); // For file upload
router.post('/create', DeliveryController.createRequest);

// List all pending requests (driver)
router.get('/pending', DeliveryController.listPending);

// Accept a request (driver)
router.post('/accept/:id', DeliveryController.acceptRequest);

// List deliveries for driver
router.get('/my', DeliveryController.listForDriver);

// List deliveries for customer
router.get('/customer', DeliveryController.listForCustomer);

export default router;
