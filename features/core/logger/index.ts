import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 0;

export { LoggerLive } from '@/features/core/logger/di/layer';
export { useReportFailure } from '@/features/core/logger/facades/useReportFailure';
export { logBackgroundFailure } from '@/features/core/logger/useCases/logBackgroundFailure';
