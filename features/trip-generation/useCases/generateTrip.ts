import { Cause, type Duration, Effect, Schedule } from 'effect';
import {
  AiService,
  AiSpanKeys,
  GeminiExtractionError,
  GeminiSearchError,
  isTransient,
  travelPlanPrompt,
} from '@/features/ai';
import { formatDateForPromptUseCase } from '@/features/core/dates';
import { type SpanOptions, startSpan } from '@/features/core/performance';
import type { TripAiResp } from '@/features/trips';

export type GenerateTripParams = {
  location: string;
  totalNoOfDays: number;
  travelersNumber: number;
  travelerType: string;
  budgetInfo: string;
  startDate: Date;
  endDate: Date;
  locale: string;
};

/** How long one search attempt may take before it fails. */
export const SEARCH_TIMEOUT: Duration.DurationInput = '1 minute';

/** How long one extract attempt may take: a long trip is a long answer. */
export const EXTRACT_TIMEOUT: Duration.DurationInput = '4 minutes';

/** A transient failure is tried twice more, 2 then 4 seconds later. */
export const RETRY_SCHEDULE = Schedule.exponential('2 seconds').pipe(Schedule.compose(Schedule.recurs(2)));

const promptFor = (params: GenerateTripParams) =>
  travelPlanPrompt
    .replaceAll('{location}', params.location)
    .replaceAll('{days}', params.totalNoOfDays.toString())
    .replaceAll('{nights}', (params.totalNoOfDays - 1).toString())
    .replaceAll('{travelersNumber}', params.travelersNumber.toString())
    .replaceAll('{travelersType}', params.travelerType)
    .replaceAll('{budget}', params.budgetInfo)
    .replaceAll('{startDate}', formatDateForPromptUseCase.execute(params.startDate))
    .replaceAll('{endDate}', formatDateForPromptUseCase.execute(params.endDate))
    .replaceAll('{locale}', params.locale);

/** One step of the pipeline: each attempt times out on its own, transient failures retry, all in one span. */
const step =
  <E extends { readonly _tag: string }>(span: SpanOptions, timeout: Duration.DurationInput, onTimeout: () => E) =>
  <A, F extends { readonly _tag: string }, R>(effect: Effect.Effect<A, F, R>) =>
    effect.pipe(
      Effect.timeoutFail({ duration: timeout, onTimeout }),
      Effect.retry({ schedule: RETRY_SCHEDULE, while: isTransient }),
      startSpan(span),
    );

/**
 * Generates a trip plan from the user's inputs: a grounded search for the destination, then the
 * extraction of a structured trip from what it found.
 */
export const generateTrip = (params: GenerateTripParams) =>
  Effect.gen(function* () {
    const ai = yield* AiService;
    const prompt = promptFor(params);

    const context = yield* ai
      .search(prompt)
      .pipe(
        step(
          AiSpanKeys.search,
          SEARCH_TIMEOUT,
          () => new GeminiSearchError({ transient: false, cause: new Cause.TimeoutException() }),
        ),
      );
    const trip: TripAiResp = yield* ai
      .extractTrip(prompt, context)
      .pipe(
        step(
          AiSpanKeys.extract,
          EXTRACT_TIMEOUT,
          () => new GeminiExtractionError({ transient: false, cause: new Cause.TimeoutException() }),
        ),
      );

    return trip;
  }).pipe(startSpan(AiSpanKeys.generate));
