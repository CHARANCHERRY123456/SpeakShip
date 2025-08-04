// src/features/coins/routes/coinsRoutes.js
import express from 'express';
import CoinsService from '../../coins/services/CoinsService.js';

const router = express.Router();

router.get('/balance/:customerId', async (req, res) => {
  try {
    const coins = await CoinsService.getBalance(req.params.customerId);
    res.json({ coins });
  } catch (err) {
    console.error('Failed to get coins:', err);
    res.status(500).json({ error: 'Failed to get coins' });
  }
});

export default router;
