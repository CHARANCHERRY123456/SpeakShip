import axios from './axios';

export async function fetchGeminiPrice({ pickupAddress, dropoffAddress, packageName, urgency, weight }) {
  const res = await axios.post('/api/price/gemini', {
    pickupAddress,
    dropoffAddress,
    packageName,
    urgency,
    weight,
  });
  return res.data; // { price, distance, estimatedDelivery }
}
