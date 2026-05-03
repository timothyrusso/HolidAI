import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 0;

export { performanceTracker } from '@/features/core/performance/di/resolve';
export { PERFORMANCE_TYPES } from '@/features/core/performance/di/types';
export { MeasurementUnit } from '@/features/core/performance/domain/entities/MeasurementUnit';
export type { IPerformanceTracker } from '@/features/core/performance/domain/entities/services/IPerformanceTracker';
export type { SpanOptions } from '@/features/core/performance/domain/entities/SpanOptions';
