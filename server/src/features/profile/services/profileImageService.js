import { updateUserProfileImage, getUserById, removeUserProfileImage } from '../repository/profileRepository.js';
import { deleteImageFromCloudinary, getPublicIdFromUrl } from '../utils/imageUtils.js';
import { DEFAULT_PROFILE_IMAGE_URL } from '../../../constants/globalConstants.js';

export const uploadProfileImageService = async (userId, imageUrl) => {
  // Save new image URL to user
  return updateUserProfileImage(userId, imageUrl);
};

export const editProfileImageService = async (userId, newImageUrl) => {
  const user = await getUserById(userId);
  if (user && user.profileImage && user.profileImage !== DEFAULT_PROFILE_IMAGE_URL) {
    const publicId = getPublicIdFromUrl(user.profileImage);
    await deleteImageFromCloudinary(publicId);
  }
  return updateUserProfileImage(userId, newImageUrl);
};

export const removeProfileImageService = async (userId) => {
  const user = await getUserById(userId);
  if (user && user.profileImage && user.profileImage !== DEFAULT_PROFILE_IMAGE_URL) {
    const publicId = getPublicIdFromUrl(user.profileImage);
    await deleteImageFromCloudinary(publicId);
  }
  return removeUserProfileImage(userId, DEFAULT_PROFILE_IMAGE_URL);
};
