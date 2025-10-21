import {
  uploadProfileImageService,
  editProfileImageService,
  removeProfileImageService,
} from '../services/profileImageService.js';
import {
  PROFILE_IMAGE_UPLOAD_ERROR,
  PROFILE_IMAGE_EDIT_ERROR,
  PROFILE_IMAGE_REMOVE_ERROR,
} from '../constants/profileConstants.js';

export const uploadProfileImage = async (req, res) => {
  try {
    console.log('uploadProfileImage called');
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const userId = req.user.id;
    const userType = req.user.role;
    const updatedUser = await uploadProfileImageService(userId, userType, req.file.path);
    res.json({ url: updatedUser.photoUrl });
  } catch (err) {
    console.error('Error in uploadProfileImage:', err);
    res.status(500).json({ error: PROFILE_IMAGE_UPLOAD_ERROR });
  }
};

export const editProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const userId = req.user.id;
    const userType = req.user.role;
    const updatedUser = await editProfileImageService(userId, userType, req.file.path);
    res.json({ url: updatedUser.photoUrl });
  } catch (err) {
    res.status(500).json({ error: PROFILE_IMAGE_EDIT_ERROR });
  }
};

export const removeProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.role;
    const DEFAULTS = {
      customer: 'https://i.pinimg.com/736x/cf/3f/5c/cf3f5c9f2d8362f9111cf7f7c93cf42f.jpg',
      admin:    'https://i.pinimg.com/736x/cf/3f/5c/cf3f5c9f2d8362f9111cf7f7c93cf42f.jpg',
      driver:   'https://th-i.thgim.com/public/entertainment/movies/opp827/article25525252.ece/alternates/FREE_1200/Taxiwala'
    };
    const defaultUrl = DEFAULTS[userType] || DEFAULTS.customer;
    await removeProfileImageService(userId, userType, defaultUrl);
    res.json({ url: defaultUrl });
  } catch (err) {
    res.status(500).json({ error: PROFILE_IMAGE_REMOVE_ERROR });
  }
};
