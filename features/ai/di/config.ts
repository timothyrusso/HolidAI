import 'reflect-metadata';
import { container } from 'tsyringe';

import { GeminiClient } from '@/features/ai/data/services/GeminiClient';
import type { IAiClient } from '@/features/ai/domain/entities/services/IAiClient';
import { geminiProvider } from './factories/gemini';
import { AI_TYPES } from './types';

container.registerInstance(AI_TYPES.GeminiProvider, geminiProvider);
container.registerSingleton<IAiClient>(AI_TYPES.GeminiAiClient, GeminiClient);
