import 'reflect-metadata';

import '@/features/ai/di/config';
import { AI_TYPES } from '@/features/ai/di/types';
import type { IAiClient } from '@/features/ai/domain/entities/services/IAiClient';
import { container } from 'tsyringe';

export const geminiAiClient = container.resolve<IAiClient>(AI_TYPES.GeminiAiClient);
