import { updateUserProfileImage, getUserById, removeUserProfileImage } from '../repository/profileRepository.js';
import { deleteImageFromCloudinary, getPublicIdFromUrl } from '../utils/imageUtils.js';
import { DEFAULT_PROFILE_IMAGE_URL } from '../../../constants/globalConstants.js';

export const uploadProfileImageService = async (userId, userType, imageUrl) => {
  // Save new image URL to user
  return updateUserProfileImage(userId, userType, imageUrl);
};

export const editProfileImageService = async (userId, userType, newImageUrl) => {
  const user = await getUserById(userId, userType);
  if (user && user.profileImage && user.profileImage !== DEFAULT_PROFILE_IMAGE_URL) {
    const publicId = getPublicIdFromUrl(user.profileImage);
    await deleteImageFromCloudinary(publicId);
  }
  return updateUserProfileImage(userId, userType, newImageUrl);
};

export const removeProfileImageService = async (userId, userType) => {
  const user = await getUserById(userId, userType);
  if (user && user.profileImage && user.profileImage !== DEFAULT_PROFILE_IMAGE_URL) {
    const publicId = getPublicIdFromUrl(user.profileImage);
    await deleteImageFromCloudinary(publicId);
  }
  return removeUserProfileImage(userId, userType, DEFAULT_PROFILE_IMAGE_URL);
};
