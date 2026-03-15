import 'reflect-metadata';
import { container } from 'tsyringe';

import { GeminiClient } from '@/features/ai/data/services/GeminiClient';
import type { IAiClient } from '@/features/ai/domain/entities/services/IAiClient';
import { AI_TYPES } from './types';

container.registerSingleton<IAiClient>(AI_TYPES.AiClient, GeminiClient);
