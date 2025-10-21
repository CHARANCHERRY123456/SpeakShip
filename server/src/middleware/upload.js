// This file is deprecated. Multer/local uploads are no longer used after Cloudinary migration.
import multer from 'multer';


const storage = multer.memoryStorage(); // Store file in memory for direct upload to Cloudinary

const upload = multer({ storage });

export default upload;
