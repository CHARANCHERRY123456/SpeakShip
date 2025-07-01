import { getGeminiPriceSuggestion } from '../services/PriceService.js';

const PriceController = {
  async getGeminiPrice(req, res) {
    try {
      const { pickupAddress, dropoffAddress, packageName, urgency, weight } = req.body;
      // Enhanced address validation
      const isInvalidAddress = (address) => {
        if (!address || typeof address !== 'string') return true;
        const trimmed = address.trim().toLowerCase();
        return (
          trimmed === '' ||
          trimmed === 'fetching address...' ||
          trimmed === 'select address' ||
          trimmed.length < 10 // arbitrary minimum length for a real address
        );
      };
      if (
        !pickupAddress || !dropoffAddress || !packageName || !urgency || !weight ||
        isInvalidAddress(pickupAddress) || isInvalidAddress(dropoffAddress)
      ) {
        return res.status(400).json({ error: 'Missing or invalid required fields (address).' });
      }
      const result = await getGeminiPriceSuggestion({ pickupAddress, dropoffAddress, packageName, urgency, weight });
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
