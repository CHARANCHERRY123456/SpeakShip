import multer from "multer";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import cloudinary from '../utils/cloudinary.js';


const getUploader = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,
      allowed_formats: ['jpg', 'jpeg', 'png'],
    },
  });
  return multer({ storage });
};

export { getUploader };