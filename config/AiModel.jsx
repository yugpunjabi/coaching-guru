import Constants from 'expo-constants';
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load API Key
const apiKey =
  Constants?.manifest?.extra?.EXPO_PUBLIC_GEMINI_API_KEY ||
  Constants?.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('❌ Gemini API key not found. Check .env and app.config.js');
}

// Initialize the model
const genAI = new GoogleGenerativeAI(apiKey);

const courseModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
});

export const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

// Used in onGenerateTopic (short response)
export async function getChatModel() {
  return await courseModel.startChat({
    generationConfig,
    history: [],
  });
}

// Used in onGenerateCourse (long response)
export async function getCourseModel() {
  return courseModel;
}
