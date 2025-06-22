import express from 'express';
import ProfileController from '../controllers/ProfileController.js';
import { authenticate } from '../../../middleware/authenticate.js';

const router = express.Router();

// Get current user's profile
router.get('/', authenticate(['customer', 'driver', 'admin']), ProfileController.getProfile);

// Update current user's profile
router.put('/', authenticate(['customer', 'driver', 'admin']), ProfileController.updateProfile);

export default router;
