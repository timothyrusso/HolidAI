import { itEffect } from '@timothyrusso/effect-core/testing';
import { Effect, Layer } from 'effect';
import type { SpanOptions } from '@/features/core/performance/domain/entities/SpanOptions';
import { PerformanceTracker } from '@/features/core/performance/domain/services/PerformanceTracker';
import { startSpan } from '@/features/core/performance/useCases/startSpan';

/** A `PerformanceTracker` that keeps each span it ran and how it ended. */
const PerformanceTrackerFake = () => {
  const spans: { name: string; outcome: 'ok' | 'failed' }[] = [];
  const layer = Layer.succeed(PerformanceTracker, {
    withSpan: (options: SpanOptions, effect) =>
      effect.pipe(
        Effect.tapBoth({
          onSuccess: () => Effect.sync(() => void spans.push({ name: options.name, outcome: 'ok' })),
          onFailure: () => Effect.sync(() => void spans.push({ name: options.name, outcome: 'failed' })),
        }),
      ),
  });
  return { layer, spans };
};

const succeeding = PerformanceTrackerFake();
const failing = PerformanceTrackerFake();

describe('startSpan', () => {
  itEffect(
    'returns the value of the Effect it measures, inside a span of that name',
    Effect.gen(function* () {
      const value = yield* Effect.succeed(3).pipe(startSpan({ name: 'trip.generate', op: 'ai.run' }));

      expect(value).toBe(3);
      expect(succeeding.spans).toEqual([{ name: 'trip.generate', outcome: 'ok' }]);
    }),
    succeeding.layer,
  );

  itEffect(
    'keeps the failure of the Effect it measures',
    Effect.gen(function* () {
      const error = yield* Effect.flip(Effect.fail('timeout').pipe(startSpan({ name: 'trip.generate', op: 'ai.run' })));

      expect(error).toBe('timeout');
      expect(failing.spans).toEqual([{ name: 'trip.generate', outcome: 'failed' }]);
    }),
    failing.layer,
  );
});
