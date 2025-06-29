import express from 'express';
import PriceController from '../controllers/PriceController.js';

const router = express.Router();

// POST /api/price/gemini
router.post('/gemini', PriceController.getGeminiPrice);

export default router;
