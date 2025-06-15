import Constants from 'expo-constants';
const {
  GoogleGenerativeAI,
} = require('@google/generative-ai');

// ✅ Get API key from Constants
const apiKey =
  Constants?.manifest?.extra?.EXPO_PUBLIC_GEMINI_API_KEY ||
  Constants?.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('❌ Gemini API key not found. Check .env and app.config.js');
}

// ✅ Initialize the generative AI
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

// ✅ Async chat model getter
export async function getChatModel() {
  return await model.startChat({
    generationConfig,
    history: [
      {
        role: 'user',
        parts: [{ text: 'Learn Python :: As you\'re a coaching teacher' }],
      },
      {
        role: 'model',
        parts: [{ text: 'Sure! Let\'s get started with Python.' }],
      },
    ],
  });
}
