import 'reflect-metadata';
import './config';

import { container } from 'tsyringe';

import type { IAiClient } from '@/features/ai/domain/entities/services/IAiClient';
import { AI_TYPES } from './types';

export const geminiAiClient = container.resolve<IAiClient>(AI_TYPES.GeminiAiClient);
