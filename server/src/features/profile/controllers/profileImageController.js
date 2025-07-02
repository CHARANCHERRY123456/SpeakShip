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
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const userId = req.user._id; // Assumes authentication middleware sets req.user
    const updatedUser = await uploadProfileImageService(userId, req.file.path);
    res.json({ url: updatedUser.profileImage });
  } catch (err) {
    res.status(500).json({ error: PROFILE_IMAGE_UPLOAD_ERROR });
  }
};

export const editProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const userId = req.user._id;
    const updatedUser = await editProfileImageService(userId, req.file.path);
    res.json({ url: updatedUser.profileImage });
  } catch (err) {
    res.status(500).json({ error: PROFILE_IMAGE_EDIT_ERROR });
  }
};

export const removeProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const updatedUser = await removeProfileImageService(userId);
    res.json({ url: updatedUser.profileImage });
  } catch (err) {
    res.status(500).json({ error: PROFILE_IMAGE_REMOVE_ERROR });
  }
};
