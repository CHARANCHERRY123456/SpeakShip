import express from 'express';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

// Customer routes
router.post('/signup/customer', AuthController.registerCustomer);
router.post('/login/customer', AuthController.loginCustomer);

// Driver routes
router.post('/signup/driver', AuthController.registerDriver);
router.post('/login/driver', AuthController.loginDriver);

// Admin routes
router.post('/login/admin', AuthController.loginAdmin);

// Logout (stateless for JWT)
router.post('/logout', AuthController.logout);

export default router;
