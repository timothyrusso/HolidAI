import { createGoogleGenerativeAI } from '@ai-sdk/google';
import Constants from 'expo-constants';
import 'reflect-metadata';
import { container } from 'tsyringe';

import { GeminiClient } from '@/features/ai/data/services/GeminiClient';
import type { IAiClient } from '@/features/ai/domain/entities/services/IAiClient';
import { AI_TYPES } from './types';

// Gemini setup
const apiKey = Constants.expoConfig?.extra?.googleGeminiApiKey;
if (!apiKey) throw new Error('Missing Google Gemini API key. Set googleGeminiApiKey in app.config.ts extra.');
const googleClient = createGoogleGenerativeAI({ apiKey });

container.registerInstance(AI_TYPES.GoogleClient, googleClient);
container.registerSingleton<IAiClient>(AI_TYPES.AiClient, GeminiClient);
