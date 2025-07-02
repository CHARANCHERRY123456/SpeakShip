import express from 'express';
import { getUploader } from '../../../middleware/cloudinary.upload.js';
import { uploadProfileImage, editProfileImage, removeProfileImage } from '../controllers/profileImageController.js';
import authenticate from '../../../middleware/authenticate.js';

const router = express.Router();

// Upload profile image
router.post('/upload-image', authenticate, getUploader('profile_pics').single('image'), uploadProfileImage);

// Edit (replace) profile image
router.put('/edit-image', authenticate, getUploader('profile_pics').single('image'), editProfileImage);

// Remove profile image
router.delete('/remove-image', authenticate, removeProfileImage);

export default router;
