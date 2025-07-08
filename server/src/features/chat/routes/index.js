import express from 'express';
import {
  accessChat,
  getMessages,
  sendMessage
} from '../controllers/chat.controller.js';

const router = express.Router();

// Create or get existing chat between customer and driver for a delivery
router.post('/access', accessChat);

// Get all messages for a chat
router.get('/:chatId/messages', getMessages);

// Send a new message in a chat
router.post('/:chatId/messages', sendMessage);

export default router;
