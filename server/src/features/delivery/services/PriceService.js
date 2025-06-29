import axios from 'axios';

// You should set GEMINI_API_KEY in your environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function getGeminiPriceSuggestion({ pickupAddress, dropoffAddress, packageName, urgency }) {
  if (!GEMINI_API_KEY) throw new Error('Gemini API key not set');

  // Build a prompt for Gemini
  const prompt = `You are a smart delivery price estimator. Given the following details, suggest a fair delivery price in INR (Indian Rupees) as a number only, no currency symbol or text.\nPickup: ${pickupAddress}\nDrop-off: ${dropoffAddress}\nPackage: ${packageName}\nUrgency: ${urgency}\nReply with only the price as a number.`;

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
    // Parse Gemini's response
    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const price = parseFloat(text.replace(/[^\d.]/g, ''));
    return {
      suggestedPrice: isNaN(price) ? null : price,
      geminiRaw: text,
      prompt
    };
  } catch (err) {
    throw new Error('Gemini API error: ' + (err.response?.data?.error?.message || err.message));
  }
}
