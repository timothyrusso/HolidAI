import '@/features/ai/di/config';

import { container } from '@/di/container';
import { AI_TYPES } from '@/features/ai/di/types';
import type { IAiClient } from '@/features/ai/domain/entities/services/IAiClient';

export const geminiAiClient = container.get<IAiClient>(AI_TYPES.GeminiAiClient);
