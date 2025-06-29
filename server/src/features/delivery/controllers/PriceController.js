import { getGeminiPriceSuggestion } from '../services/PriceService.js';

const PriceController = {
  async getGeminiPrice(req, res) {
    try {
      const { pickupAddress, dropoffAddress, packageName, urgency } = req.body;
      if (!pickupAddress || !dropoffAddress || !packageName || !urgency) {
        return res.status(400).json({ error: 'Missing required fields.' });
      }
      const result = await getGeminiPriceSuggestion({ pickupAddress, dropoffAddress, packageName, urgency });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message || 'Failed to get price suggestion.' });
    }
  }
};

export default PriceController;
