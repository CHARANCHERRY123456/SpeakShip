import express from 'express';
import AuthController, { sendOtp, verifyOtp, googleAuth, googleCallback, getMe } from '../controllers/AuthController.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Customer routes
router.post('/signup/customer', AuthController.registerCustomer);
router.post('/login/customer', AuthController.loginCustomer);

// Driver routes
router.post('/signup/driver', AuthController.registerDriver);
router.post('/login/driver', AuthController.loginDriver);

// Admin routes
router.post('/login/admin', AuthController.loginAdmin);

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// User profile route
router.get('/me', getMe);

// Logout (stateless for JWT)
router.post('/logout', AuthController.logout);

export default router;