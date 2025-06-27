import express from 'express';
import AuthController, { sendOtp, verifyOtp } from '../controllers/AuthController.js'; // Import named exports

const router = express.Router();

// OTP related routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Customer routes
// These routes will now implicitly require OTP verification before client calls them
router.post('/signup/customer', AuthController.registerCustomer);
router.post('/login/customer', AuthController.loginCustomer);

// Driver routes
// These routes will now implicitly require OTP verification before client calls them
router.post('/signup/driver', AuthController.registerDriver);
router.post('/login/driver', AuthController.loginDriver);

// Admin routes
router.post('/login/admin', AuthController.loginAdmin);

// Logout (stateless for JWT)
router.post('/logout', AuthController.logout);

export default router;