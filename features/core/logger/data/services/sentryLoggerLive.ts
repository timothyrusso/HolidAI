import { Logger } from '@timothyrusso/effect-core';
import { Effect, Layer } from 'effect';
import { Sentry } from '@/features/core/sentry';

/**
 * The release-build `Logger`: errors (every defect the boundary turns into an `UnexpectedError`)
 * go to Sentry; warnings, info and debug lines are dropped, so typed failures send no noise.
 */
export const SentryLoggerLive = Layer.effect(
  Logger,
  Effect.map(Sentry, sentry => ({
    error: (error, context) => sentry.captureException(error, context),
    warn: () => Effect.void,
    info: () => Effect.void,
    debug: () => Effect.void,
  })),
);
