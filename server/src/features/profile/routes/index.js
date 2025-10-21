import express from 'express';
import ProfileController from '../controllers/ProfileController.js';
import { authenticate } from '../../../middleware/authenticate.js';
import { getUploader } from '../../../middleware/cloudinary.upload.js';
import { uploadProfileImage, editProfileImage, removeProfileImage } from '../controllers/profileImageController.js';

const router = express.Router();

router.get('/', authenticate(['customer', 'driver', 'admin']), ProfileController.getProfile);

router.put('/', authenticate(['customer', 'driver', 'admin']), ProfileController.updateProfile);

router.post('/upload-image', authenticate(['customer', 'driver', 'admin']), getUploader('profile_pics').single('image'), uploadProfileImage);

router.put('/edit-image', authenticate(['customer', 'driver', 'admin']), getUploader('profile_pics').single('image'), editProfileImage);

router.delete('/remove-image', authenticate(['customer', 'driver', 'admin']), removeProfileImage);

export default router;
