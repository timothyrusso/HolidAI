import { Context, type Effect } from 'effect';
import type { GeminiExtractionError, GeminiSearchError } from '@/features/ai/domain/errors/AiErrors';
import type { GeneratedTrip } from '@/features/ai/domain/schemas/GeneratedTripSchema';
import type { ConfigMissing } from '@/features/core/error';

/** The model behind trip generation, in two steps: a grounded search, then a structured extraction. */
export class AiService extends Context.Tag('ai/AiService')<
  AiService,
  {
    /** What a Google Search grounded answer to `prompt` says, as plain text. */
    readonly search: (prompt: string) => Effect.Effect<string, GeminiSearchError | ConfigMissing>;
    /** The trip `prompt` asks for, built from the search `context` only. */
    readonly extractTrip: (
      prompt: string,
      context: string,
    ) => Effect.Effect<GeneratedTrip, GeminiExtractionError | ConfigMissing>;
  }
>() {}
