import { collectLogs, itEffect } from '@timothyrusso/effect-core/testing';
import { Effect, Fiber } from 'effect';
import { NetworkFailure } from '@/features/core/error';
import { logBackgroundFailure } from '@/features/core/logger/useCases/logBackgroundFailure';

const quiet = collectLogs();
const failing = collectLogs();
const interrupted = collectLogs();

describe('logBackgroundFailure', () => {
  itEffect(
    'logs nothing when the task succeeds',
    Effect.gen(function* () {
      yield* Effect.succeed('enriched').pipe(logBackgroundFailure('enrich dish images'));

      expect(quiet.entries).toEqual([]);
    }),
    quiet.layer,
  );

  itEffect(
    'logs a failure once as a warning naming the task, and succeeds',
    Effect.gen(function* () {
      const failure = new NetworkFailure({ url: 'https://commons.wikimedia.org/w/api.php' });

      yield* Effect.fail(failure).pipe(logBackgroundFailure('enrich dish images'));

      expect(failing.entries).toEqual([
        { level: 'warn', message: 'enrich dish images failed', error: undefined, context: { cause: failure } },
      ]);
    }),
    failing.layer,
  );

  itEffect(
    'logs nothing when the task is interrupted',
    Effect.gen(function* () {
      const fiber = yield* Effect.fork(Effect.never.pipe(logBackgroundFailure('enrich dish images')));

      yield* Fiber.interrupt(fiber);

      expect(interrupted.entries).toEqual([]);
    }),
    interrupted.layer,
  );
});
