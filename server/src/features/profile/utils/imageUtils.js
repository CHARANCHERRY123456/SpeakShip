import cloudinary from '../../../utils/cloudinary.js';

// Delete an image from Cloudinary by public_id
export const deleteImageFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    // Log error, but don't throw to avoid breaking user flow
    console.error('Cloudinary deletion error:', err.message);
  }
};

// Extract public_id from a Cloudinary URL
export const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  // Example: https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/folder/filename.jpg
  const parts = url.split('/');
  const folderAndFile = parts.slice(-2).join('/');
  return folderAndFile.split('.')[0]; // folder/filename
};
