import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 1;

export { geminiAiClient } from '@/features/ai/di/resolve';
export { AI_TYPES } from '@/features/ai/di/types';
export { AiModels } from '@/features/ai/domain/entities/AiModels';
export type { IAiClient } from '@/features/ai/domain/entities/services/IAiClient';
export { travelPlanPrompt } from '@/features/ai/domain/entities/travelPlanPrompt';
