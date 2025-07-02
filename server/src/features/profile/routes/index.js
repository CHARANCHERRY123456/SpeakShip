import express from 'express';
import ProfileController from '../controllers/ProfileController.js';
import { authenticate } from '../../../middleware/authenticate.js';
import { getUploader } from '../../../middleware/cloudinary.upload.js';
import { uploadProfileImage, editProfileImage, removeProfileImage } from '../controllers/profileImageController.js';

const router = express.Router();

// Get current user's profile
router.get('/', authenticate(['customer', 'driver', 'admin']), ProfileController.getProfile);

// Update current user's profile
router.put('/', authenticate(['customer', 'driver', 'admin']), ProfileController.updateProfile);

// Upload profile image
router.post('/upload-image', authenticate(['customer', 'driver', 'admin']), getUploader('profile_pics').single('image'), uploadProfileImage);

// Edit (replace) profile image
router.put('/edit-image', authenticate(['customer', 'driver', 'admin']), getUploader('profile_pics').single('image'), editProfileImage);

// Remove profile image
router.delete('/remove-image', authenticate(['customer', 'driver', 'admin']), removeProfileImage);

export default router;
