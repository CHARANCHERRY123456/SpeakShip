import axios from './axios';

export async function fetchGeminiPrice({ 
  pickupAddress, 
  dropoffAddress, 
  pickupLat, 
  pickupLon, 
  dropoffLat, 
  dropoffLon, 
  packageName, 
  urgency, 
  weight 
}) {
  const res = await axios.post('/api/price/gemini', {
    pickupAddress,
    dropoffAddress,
    pickupLat,
    pickupLon,
    dropoffLat,
    dropoffLon,
    packageName,
    urgency,
    weight,
  });
  return res.data; // { price, distance, estimatedDelivery }
}
