import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 1;

export { AiLive } from '@/features/ai/di/layer';
export { travelPlanPrompt } from '@/features/ai/domain/entities/travelPlanPrompt';
export {
  GeminiExtractionError,
  GeminiSearchError,
  type GenerationFailed,
  isTransient,
} from '@/features/ai/domain/errors/AiErrors';
export type { GeneratedTrip } from '@/features/ai/domain/schemas/GeneratedTripSchema';
export { AiService } from '@/features/ai/domain/services/AiService';
export { SpanKeys as AiSpanKeys } from '@/features/ai/domain/utils/SpanKeys';
