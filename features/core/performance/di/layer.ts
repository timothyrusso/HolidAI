import type { Layer } from 'effect';
import {
  NoopPerformanceTrackerLive,
  SentryPerformanceTrackerLive,
} from '@/features/core/performance/data/services/performanceTrackerLive';
import type { PerformanceTracker } from '@/features/core/performance/domain/services/PerformanceTracker';
import type { Sentry } from '@/features/core/sentry';

/** The `PerformanceTracker` the runtime provides: a no-op in development, Sentry in release builds. */
export const PerformanceLive: Layer.Layer<PerformanceTracker, never, Sentry> = __DEV__
  ? NoopPerformanceTrackerLive
  : SentryPerformanceTrackerLive;
