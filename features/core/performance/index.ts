import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 0;

export { PerformanceLive } from '@/features/core/performance/di/layer';
export { performanceTracker } from '@/features/core/performance/di/resolve';
export { PERFORMANCE_TYPES } from '@/features/core/performance/di/types';
export { MeasurementUnit } from '@/features/core/performance/domain/entities/MeasurementUnit';
export type { SpanOptions } from '@/features/core/performance/domain/entities/SpanOptions';
export type { IPerformanceTracker } from '@/features/core/performance/domain/entities/services/IPerformanceTracker';
export { PerformanceTracker } from '@/features/core/performance/domain/services/PerformanceTracker';
export { startSpan } from '@/features/core/performance/useCases/startSpan';
