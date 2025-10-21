import axios from 'axios';
import config from '../../../config/config.js';
import { PRICE_PER_KM, WEIGHT_MULTIPLIER } from '../priceConstants.js';

// Haversine formula: calculate distance between two lat/lon points in km
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRadians = deg => deg * (Math.PI / 180);
  const R = 6371; // Earth radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  // formula to find the distance
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deterministicFallbackKm(pickup, dropoff) {
  const s = `${pickup || ''}::${dropoff || ''}`;
  let sum = 0;
  for (let i = 0; i < s.length; i++) sum += s.charCodeAt(i);
  const value = ((sum % 180) / 10) + 2; // 2.0 - 19.9 km
  return Math.round(value * 10) / 10;
}

function calculateDeliveryPrice({ distance, urgency, weight }) {
  const u = ('' + (urgency || 'normal')).toLowerCase();
  const basePerKm = PRICE_PER_KM[u] || PRICE_PER_KM.normal;
  const w = Number(weight) || 0;
  let multiplier = 1;
  for (const range of WEIGHT_MULTIPLIER) {
    if (w >= range.min && w <= range.max) {
      multiplier = range.multiplier;
      break;
    }
  }
  return Math.round(distance * basePerKm * multiplier);
}

function calculateDeliveryTimeEstimate(distance, urgency) {
  const u = ('' + (urgency || 'normal')).toLowerCase();
  if (u === 'overnight') {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    return d;
  }
  const hours = u === 'urgent' ? distance * 0.2 : distance * 0.3;
  const ms = Math.round(hours * 3600000);
  return new Date(Date.now() + ms);
}

export async function getGeminiPriceSuggestion({ 
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
  urgency = (urgency || 'normal').toLowerCase();
  weight = Number(weight) || 0;

  let distance = await tryGetDistance(pickupAddress, dropoffAddress, pickupLat, pickupLon, dropoffLat, dropoffLon);

  const price = calculateDeliveryPrice({ distance, urgency, weight });
  const estimatedDelivery = calculateDeliveryTimeEstimate(distance, urgency);

  return {
    price,
    distance: Math.round(distance * 10) / 10,
    estimatedDelivery,
  };
}

async function tryGetDistance(pickupAddress, dropoffAddress, pickupLat, pickupLon, dropoffLat, dropoffLon) {
  const USE_GEMINI = true; // Set to false to disable AI distance estimation
  if (USE_GEMINI && config.GEMINI_API_KEY && config.GEMINI_API_URL) {
    const geminiDistance = await getDistanceFromGemini(pickupAddress, dropoffAddress);
    if (geminiDistance) return geminiDistance;
  }

  if (pickupLat && pickupLon && dropoffLat && dropoffLon) {
    return haversineDistance(Number(pickupLat), Number(pickupLon), Number(dropoffLat), Number(dropoffLon));
  }

  return deterministicFallbackKm(pickupAddress, dropoffAddress);
}

async function getDistanceFromGemini(pickupAddress, dropoffAddress) {
  try {
    const prompt = `Estimate the distance in kilometers.\nPickup: ${pickupAddress}\nDrop-off: ${dropoffAddress}`;
    const response = await axios.post(
      `${config.GEMINI_API_URL}?key=${config.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    const kmMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:km|kilometers?)/i);
    if (kmMatch) return parseFloat(kmMatch[1]);
    
    const numMatch = text.match(/(\d+(?:\.\d+)?)/);
    if (numMatch) return parseFloat(numMatch[1]);
    
    return null;
  } catch (error) {
    return null;
  }
}
