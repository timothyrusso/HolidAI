import 'reflect-metadata';
import { container } from 'tsyringe';

import { GeminiClient } from '@/features/ai/data/services/GeminiClient';
import { geminiProvider } from '@/features/ai/di/factories/gemini';
import { AI_TYPES } from '@/features/ai/di/types';
import type { IAiClient } from '@/features/ai/domain/entities/services/IAiClient';

container.registerInstance(AI_TYPES.GeminiProvider, geminiProvider);
container.registerSingleton<IAiClient>(AI_TYPES.GeminiAiClient, GeminiClient);
