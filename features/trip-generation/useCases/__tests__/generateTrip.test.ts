import { advanceClock, itEffect } from '@timothyrusso/effect-core/testing';
import { Effect, Either, Fiber, Layer } from 'effect';
import { GeminiExtractionError, GeminiSearchError } from '@/features/ai';
import { PerformanceTracker } from '@/features/core/performance';
import { aGeneratedTrip, aTripRequest } from '@/features/trip-generation/__fixtures__/builders';
import { AiServiceFake } from '@/features/trip-generation/di/__tests__/aiServiceFake';
import { EXTRACT_TIMEOUT, generateTrip, SEARCH_TIMEOUT } from '@/features/trip-generation/useCases/generateTrip';

const NoSpans = Layer.succeed(PerformanceTracker, { withSpan: (_options, effect) => effect });
const over = (fake: ReturnType<typeof AiServiceFake>) => Layer.merge(fake.layer, NoSpans);

const CONTEXT = 'Kyoto in May: temples, tofu and mild weather.';
const transientSearch = new GeminiSearchError({ transient: true });
const transientExtraction = new GeminiExtractionError({ transient: true });
const notATrip = new GeminiExtractionError({ transient: false });

/** Runs the use case in the background, moves the test clock by `duration`, and returns its outcome. */
const generateAfter = (duration: Parameters<typeof advanceClock>[0]) =>
  Effect.gen(function* () {
    const fiber = yield* Effect.fork(Effect.either(generateTrip(aTripRequest())));
    yield* advanceClock(duration);
    return yield* Fiber.join(fiber);
  });

const answers = AiServiceFake({ search: [CONTEXT], extract: [aGeneratedTrip()] });
const prompts = AiServiceFake();
const flakySearch = AiServiceFake({ search: [transientSearch, CONTEXT] });
const flakyExtraction = AiServiceFake({ extract: [transientExtraction, aGeneratedTrip()] });
const searchDown = AiServiceFake({ search: [transientSearch] });
const searchHangs = AiServiceFake({ search: ['hang'] });
const extractionHangs = AiServiceFake({ extract: ['hang'] });
const extractionInvalid = AiServiceFake({ extract: [notATrip, aGeneratedTrip()] });

describe('generateTrip', () => {
  itEffect(
    'returns the trip extracted from what the search found',
    Effect.gen(function* () {
      expect(yield* generateTrip(aTripRequest())).toEqual(aGeneratedTrip());
      expect(answers.extractions).toEqual([CONTEXT]);
    }),
    over(answers),
  );

  itEffect(
    'asks for the destination, length, travelers, budget, dates and language of the request',
    Effect.gen(function* () {
      yield* generateTrip(aTripRequest());

      expect(prompts.searches[0]).toContain('Generate Travel Plan in en localization for Location: Kyoto, Japan');
      expect(prompts.searches[0]).toContain('for 4 Days and 3 Nights for 2 travelers');
      expect(prompts.searches[0]).toContain('the travelers type is Couple with a Moderate budget');
      expect(prompts.searches[0]).toContain('start date 2026-05-12 and end date 2026-05-15');
    }),
    over(prompts),
  );

  itEffect(
    'retries a transient search failure and returns the trip',
    Effect.gen(function* () {
      const result = yield* generateAfter('2 seconds');

      expect(result).toEqual(Either.right(aGeneratedTrip()));
      expect(flakySearch.searches).toHaveLength(2);
    }),
    over(flakySearch),
  );

  itEffect(
    'retries a transient extraction failure without searching again',
    Effect.gen(function* () {
      const result = yield* generateAfter('2 seconds');

      expect(result).toEqual(Either.right(aGeneratedTrip()));
      expect(flakyExtraction.searches).toHaveLength(1);
      expect(flakyExtraction.extractions).toHaveLength(2);
    }),
    over(flakyExtraction),
  );

  itEffect(
    'fails with GeminiSearchError after three attempts at a transient failure, without extracting',
    Effect.gen(function* () {
      const result = yield* generateAfter('6 seconds');

      expect(Either.isLeft(result) && result.left._tag).toBe('GeminiSearchError');
      expect(searchDown.searches).toHaveLength(3);
      expect(searchDown.extractions).toEqual([]);
    }),
    over(searchDown),
  );

  itEffect(
    'fails with GeminiSearchError when the search times out, without retrying or extracting',
    Effect.gen(function* () {
      const result = yield* generateAfter(SEARCH_TIMEOUT);

      expect(Either.isLeft(result) && result.left._tag).toBe('GeminiSearchError');
      expect(searchHangs.searches).toHaveLength(1);
      expect(searchHangs.extractions).toEqual([]);
    }),
    over(searchHangs),
  );

  itEffect(
    'fails with GeminiExtractionError when the extraction times out, without retrying',
    Effect.gen(function* () {
      const result = yield* generateAfter(EXTRACT_TIMEOUT);

      expect(Either.isLeft(result) && result.left._tag).toBe('GeminiExtractionError');
      expect(extractionHangs.extractions).toHaveLength(1);
    }),
    over(extractionHangs),
  );

  itEffect(
    'fails with GeminiExtractionError without retrying when the answer is not a trip',
    Effect.gen(function* () {
      const result = yield* Effect.either(generateTrip(aTripRequest()));

      expect(Either.isLeft(result) && result.left._tag).toBe('GeminiExtractionError');
      expect(extractionInvalid.extractions).toHaveLength(1);
    }),
    over(extractionInvalid),
  );
});
