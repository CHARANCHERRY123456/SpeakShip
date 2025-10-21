import cloudinary from '../../../utils/cloudinary.js';

export const deleteImageFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary deletion error:', err.message);
  }
};

export const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  // Example: https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/folder/filename.jpg
  const parts = url.split('/');
  const folderAndFile = parts.slice(-2).join('/');
  return folderAndFile.split('.')[0]; // folder/filename
};
