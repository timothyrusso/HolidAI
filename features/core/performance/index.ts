import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 0;

export { PerformanceLive } from '@/features/core/performance/di/layer';
export type { SpanOptions } from '@/features/core/performance/domain/entities/SpanOptions';
export { PerformanceTracker } from '@/features/core/performance/domain/services/PerformanceTracker';
export { startSpan } from '@/features/core/performance/useCases/startSpan';
