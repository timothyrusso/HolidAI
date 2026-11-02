import { itEffect } from '@timothyrusso/effect-core/testing';
import { Effect } from 'effect';
import { UnexpectedError } from '@/features/core/error';
import { reportFailure } from '@/features/core/logger/useCases/reportFailure';

describe('reportFailure', () => {
  itEffect(
    'fails with an UnexpectedError carrying the failure the SDK reported',
    Effect.gen(function* () {
      const failure = new Error('REQUEST_DENIED');

      const error = yield* Effect.flip(reportFailure(failure));

      expect(error._tag).toBe('UnexpectedError');
      expect(error.cause).toBe(failure);
    }),
  );

  itEffect(
    'passes an UnexpectedError through unchanged',
    Effect.gen(function* () {
      const unexpected = new UnexpectedError({ cause: 'already wrapped' });

      expect(yield* Effect.flip(reportFailure(unexpected))).toBe(unexpected);
    }),
  );
});
