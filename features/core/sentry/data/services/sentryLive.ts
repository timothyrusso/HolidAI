import { Effect, Exit, Layer } from 'effect';
import { Sentry } from '@/features/core/sentry/domain/services/Sentry';
import { captureException, startInactiveSpan } from '@/features/core/sentry/libraries/sentryBindings';

/** Sentry's status code for a span whose work failed. */
const SPAN_STATUS_ERROR = 2;

export const SentryLive = Layer.succeed(Sentry, {
  captureException: (error, context) => Effect.sync(() => captureException(error, context)),
  withSpan: (options, effect) =>
    Effect.acquireUseRelease(
      Effect.sync(() => startInactiveSpan({ name: options.name, op: options.op })),
      () => effect,
      (span, exit) =>
        Effect.sync(() => {
          if (Exit.isFailure(exit)) span.setStatus({ code: SPAN_STATUS_ERROR });
          span.end();
        }),
    ),
});
