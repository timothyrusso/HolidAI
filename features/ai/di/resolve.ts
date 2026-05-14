import '@/features/ai/di/config';

import { AI_TYPES } from '@/features/ai/di/types';
import type { IAiClient } from '@/features/ai/domain/entities/services/IAiClient';
import { container } from '@/features/core/container';

export const geminiAiClient = container.get<IAiClient>(AI_TYPES.GeminiAiClient);
