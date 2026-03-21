import 'reflect-metadata';
import '@/features/ai/di/config';

import { container } from 'tsyringe';

import { AI_TYPES } from '@/features/ai/di/types';
import type { IAiClient } from '@/features/ai/domain/entities/services/IAiClient';

export const geminiAiClient = container.resolve<IAiClient>(AI_TYPES.GeminiAiClient);
