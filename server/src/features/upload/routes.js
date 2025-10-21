// this file is depricated please ignore it

import express from 'express';
import { getUploader } from '../../middleware/cloudinary.upload.js';

const router = express.Router();

router.post('/profile', getUploader('profile_pics').single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  return res.json({ url: req.file.path });
});

router.post('/order', getUploader('order_photos').single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  return res.json({ url: req.file.path });
});

export default router;
