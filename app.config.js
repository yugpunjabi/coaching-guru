import 'dotenv/config';

export default {
  expo: {
    name: 'coaching-guru',
    slug: 'coaching-guru',
    version: '1.0.0',
    extra: {
      EXPO_PUBLIC_GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
      eas: {
        projectId: "e5beb755-0ea7-4b23-8f92-d26abc60dfd7",
      }
    },
  },
};
