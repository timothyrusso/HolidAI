import { Logger } from '@timothyrusso/effect-core';
import { Cause, Effect, Option } from 'effect';

/**
 * The boundary of work nobody awaits (a best-effort enrichment fired after the main result): it
 * has no caller to hand a failure to, so the failure is logged here, once, as the query hooks log
 * theirs, and the work ends. A typed failure is a warning; a defect is an error, so it still
 * reaches Sentry. Wrap the whole task, never a step inside it.
 */
export const logBackgroundFailure =
  (task: string) =>
  <A, E, R>(effect: Effect.Effect<A, E, R>): Effect.Effect<void, never, R | Logger> =>
    effect.pipe(
      Effect.asVoid,
      Effect.catchAllCause(cause =>
        Cause.isInterruptedOnly(cause)
          ? Effect.void
          : Effect.flatMap(Logger, logger =>
              Option.isSome(Cause.failureOption(cause))
                ? logger.warn(`${task} failed`, { cause: Cause.squash(cause) })
                : logger.error(Cause.squash(cause), { task }),
            ),
      ),
    );
