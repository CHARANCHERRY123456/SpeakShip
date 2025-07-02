import User from '../../auth/schema/User.js'; // Adjust path if needed
import { PROFILE_IMAGE_FIELD } from '../constants/profileConstants.js';

export const getUserById = async (userId) => {
  return User.findById(userId);
};

export const updateUserProfileImage = async (userId, imageUrl) => {
  return User.findByIdAndUpdate(userId, { [PROFILE_IMAGE_FIELD]: imageUrl }, { new: true });
};

export const removeUserProfileImage = async (userId, defaultUrl) => {
  return User.findByIdAndUpdate(userId, { [PROFILE_IMAGE_FIELD]: defaultUrl }, { new: true });
};
