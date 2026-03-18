import { createGoogleGenerativeAI } from '@ai-sdk/google';
import Constants from 'expo-constants';

const apiKey = Constants.expoConfig?.extra?.googleGeminiApiKey;
if (!apiKey) throw new Error('Missing Google Gemini API key. Set googleGeminiApiKey in app.config.ts extra.');

export const geminiProvider = createGoogleGenerativeAI({ apiKey });
