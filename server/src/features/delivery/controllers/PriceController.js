import { getGeminiPriceSuggestion } from '../services/PriceService.js';

const PriceController = {
  async getGeminiPrice(req, res) {
    try {
      const { pickupAddress, dropoffAddress, packageName, urgency, weight } = req.body;
      if (!pickupAddress || !dropoffAddress || !packageName || !urgency || !weight) {
        return res.status(400).json({ error: 'Missing required fields.' });
      }
      const result = await getGeminiPriceSuggestion({ pickupAddress, dropoffAddress, packageName, urgency, weight });
      // Only send price, distance, and estimatedDelivery
      res.json({
        price: result.price,
        distance: result.distance,
        estimatedDelivery: result.estimatedDelivery,
      });
    } catch (err) {
      res.status(500).json({ error: err.message || 'Failed to get price suggestion.' });
    }
  }
};

export default PriceController;
