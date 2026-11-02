import { Effect, Layer } from 'effect';
import { PerformanceTracker } from '@/features/core/performance/domain/services/PerformanceTracker';
import { Sentry } from '@/features/core/sentry';

/** Runs every span through Sentry's tracing. */
export const SentryPerformanceTrackerLive = Layer.effect(
  PerformanceTracker,
  Effect.map(Sentry, sentry => ({ withSpan: sentry.withSpan })),
);

/** Runs the Effect as it is: development sends no traces. */
export const NoopPerformanceTrackerLive = Layer.succeed(PerformanceTracker, { withSpan: (_options, effect) => effect });
