import { Context, type Effect } from 'effect';
import type { SpanOptions } from '@/features/core/performance/domain/entities/SpanOptions';

/** Measures how long an Effect takes. Swapped for a no-op in development. */
export class PerformanceTracker extends Context.Tag('performance/PerformanceTracker')<
  PerformanceTracker,
  {
    readonly withSpan: <A, E, R>(options: SpanOptions, effect: Effect.Effect<A, E, R>) => Effect.Effect<A, E, R>;
  }
>() {}
