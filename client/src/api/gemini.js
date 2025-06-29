import axios from './axios';

export async function fetchGeminiPrice({ pickupAddress, dropoffAddress, packageName, urgency }) {
  const res = await axios.post('/api/price/gemini', {
    pickupAddress,
    dropoffAddress,
    packageName,
    urgency,
  });
  return res.data;
}
