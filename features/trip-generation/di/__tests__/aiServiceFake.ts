import { Effect, Layer } from 'effect';
import { AiService, GeminiExtractionError, GeminiSearchError, type GeneratedTrip } from '@/features/ai';
import { aGeneratedTrip } from '@/features/trip-generation/__fixtures__/builders';

/** What the fake answers one attempt with: a value, a failure, or `'hang'`, which never answers. */
type Answer<A, E> = A | E | 'hang';

const reply = <A, E>(answers: readonly Answer<A, E>[], attempt: number, isFailure: (answer: A | E) => answer is E) => {
  const answer = answers[Math.min(attempt, answers.length - 1)];
  if (answer === 'hang') return Effect.never;
  return isFailure(answer) ? Effect.fail(answer) : Effect.succeed(answer);
};

const isSearchError = (answer: unknown): answer is GeminiSearchError => answer instanceof GeminiSearchError;
const isExtractionError = (answer: unknown): answer is GeminiExtractionError => answer instanceof GeminiExtractionError;

/**
 * An `AiService` that answers each attempt from a script, the last answer repeating. `searches`
 * keeps the prompt of every search attempt and `extractions` the context of every extract attempt.
 */
export const AiServiceFake = (
  script: {
    readonly search?: readonly Answer<string, GeminiSearchError>[];
    readonly extract?: readonly Answer<GeneratedTrip, GeminiExtractionError>[];
  } = {},
) => {
  const searches: string[] = [];
  const extractions: string[] = [];
  const { search = ['Kyoto in May: temples, tofu and mild weather.'], extract = [aGeneratedTrip()] } = script;

  const layer = Layer.succeed(AiService, {
    search: prompt => Effect.suspend(() => reply(search, searches.push(prompt) - 1, isSearchError)),
    extractTrip: (_prompt, context) =>
      Effect.suspend(() => reply(extract, extractions.push(context) - 1, isExtractionError)),
  });

  return { layer, searches, extractions };
};
