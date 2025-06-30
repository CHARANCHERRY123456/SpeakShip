import axios from 'axios';
import { PRICE_PER_KM, WEIGHT_MULTIPLIER } from '../priceConstants.js';

// You should set GEMINI_API_KEY in your environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Helper: fallback distance calculation (very rough, for demo)
function fallbackDistanceKm(pickup, dropoff) {
  // If you have a geocoding API, use it. Here, just return a random value for demo.
  return Math.round((Math.random() * 20 + 2) * 10) / 10; // 2-22 km
}

function calculateDeliveryPrice({ distance, urgency, weight }) {
  const urgencyKey = urgency.toLowerCase();
  const basePerKm = PRICE_PER_KM[urgencyKey] || PRICE_PER_KM.normal;
  let multiplier = 1;
  for (const range of WEIGHT_MULTIPLIER) {
    if (weight >= range.min && weight <= range.max) {
      multiplier = range.multiplier;
      break;
    }
  }
  return Math.round(distance * basePerKm * multiplier);
}

function calculateDeliveryTimeEstimate(distance, urgency) {
  const now = new Date();
  const hoursToAdd = {
    normal: distance * 0.3,
    urgent: distance * 0.2,
    overnight: 24
  };
  if (urgency.toLowerCase() === 'overnight') {
    now.setDate(now.getDate() + 1);
    now.setHours(9, 0, 0, 0);
  } else {
    now.setHours(now.getHours() + hoursToAdd[urgency.toLowerCase()]);
  }
  return now;
}

export async function getGeminiPriceSuggestion({ pickupAddress, dropoffAddress, packageName, urgency, weight }) {
  if (!GEMINI_API_KEY) throw new Error('Gemini API key not set');

  // Build a prompt for Gemini
  const prompt = `Estimate the distance in kilometers only as a number.\nPickup: ${pickupAddress}\nDrop-off: ${dropoffAddress}`;

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    // Log Gemini's raw response for debugging
    console.log('Gemini API raw response:', JSON.stringify(response.data, null, 2));
    // Parse Gemini's response
    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    // Try to extract distance
    let distance = null;
    const distMatch = text.match(/(\d+(?:\.\d+)?)/);
    if (distMatch) distance = parseFloat(distMatch[1]);
    // Fallback distance if Gemini fails
    const fallbackDistance = fallbackDistanceKm(pickupAddress, dropoffAddress);
    const finalDistance = isNaN(distance) ? fallbackDistance : distance;
    // Calculate price and estimated delivery time
    const price = calculateDeliveryPrice({ distance: finalDistance, urgency, weight });
    const deliveryTimeEstimate = calculateDeliveryTimeEstimate(finalDistance, urgency);
    return {
      price,
      distance: finalDistance,
      estimatedDelivery: deliveryTimeEstimate,
    };
  } catch (err) {
    // On Gemini error, fallback to random distance and null price
    console.error('Gemini API error:', err);
    const fallbackDistance = fallbackDistanceKm(pickupAddress, dropoffAddress);
    const price = calculateDeliveryPrice({ distance: fallbackDistance, urgency, weight });
    const deliveryTimeEstimate = calculateDeliveryTimeEstimate(fallbackDistance, urgency);
    return {
      price,
      distance: fallbackDistance,
      estimatedDelivery: deliveryTimeEstimate,
    };
  }
}
