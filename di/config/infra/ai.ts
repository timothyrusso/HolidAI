import { TYPES } from '@/di/types';
import { GeminiClient, type IAiClient } from '@/modules/ai/infra/ai';
import { container } from 'tsyringe';

container.registerSingleton<IAiClient>(TYPES.AiClient, GeminiClient);
