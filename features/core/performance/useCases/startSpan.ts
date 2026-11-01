import { Effect } from 'effect';
import type { SpanOptions } from '@/features/core/performance/domain/entities/SpanOptions';
import { PerformanceTracker } from '@/features/core/performance/domain/services/PerformanceTracker';

/**
 * Measures `effect` as a performance span named after `options`; nested spans appear as children
 * in the trace view. Use it in a pipe: `generate.pipe(startSpan({ name: 'trip.generate', op: 'ai' }))`.
 */
export const startSpan =
  (options: SpanOptions) =>
  <A, E, R>(effect: Effect.Effect<A, E, R>): Effect.Effect<A, E, R | PerformanceTracker> =>
    Effect.flatMap(PerformanceTracker, tracker => tracker.withSpan(options, effect));
