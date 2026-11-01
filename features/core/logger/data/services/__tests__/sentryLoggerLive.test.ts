import { Logger } from '@timothyrusso/effect-core';
import { itEffect } from '@timothyrusso/effect-core/testing';
import { Effect, Layer } from 'effect';
import { SentryLoggerLive } from '@/features/core/logger/data/services/sentryLoggerLive';
import { Sentry } from '@/features/core/sentry';

/** A `Sentry` that keeps what it was sent. */
const SentryFake = () => {
  const reported: { error: unknown; context: unknown }[] = [];
  const layer = Layer.succeed(Sentry, {
    captureException: (error, context) => Effect.sync(() => void reported.push({ error, context })),
    withSpan: (_options, effect) => effect,
  });
  return { layer, reported };
};

const sentryForErrors = SentryFake();
const sentryForWarnings = SentryFake();

describe('SentryLoggerLive', () => {
  itEffect(
    'reports an error to Sentry with its context',
    Effect.gen(function* () {
      const defect = new Error('boom');

      yield* Effect.flatMap(Logger, logger => logger.error(defect, { queryKey: ['image'] }));

      expect(sentryForErrors.reported).toEqual([{ error: defect, context: { queryKey: ['image'] } }]);
    }),
    SentryLoggerLive.pipe(Layer.provide(sentryForErrors.layer)),
  );

  itEffect(
    'sends nothing for warnings, info and debug lines',
    Effect.gen(function* () {
      const logger = yield* Logger;

      yield* logger.warn('NetworkFailure');
      yield* logger.info('booted');
      yield* logger.debug('cache hit');

      expect(sentryForWarnings.reported).toEqual([]);
    }),
    SentryLoggerLive.pipe(Layer.provide(sentryForWarnings.layer)),
  );
});
