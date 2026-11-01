import { AppErrorBase } from '@/features/core/error';

/**
 * The search step of trip generation failed: the request was rejected, timed out, or found
 * nothing. `transient` is true when the provider said trying again may succeed.
 */
export class GeminiSearchError extends AppErrorBase('GeminiSearchError', 'ERRORS.GENERATION')<{
  readonly transient: boolean;
}> {}

/**
 * The extract step of trip generation failed: the request was rejected or timed out, or the
 * answer is not a trip. `transient` is true when the provider said trying again may succeed.
 */
export class GeminiExtractionError extends AppErrorBase('GeminiExtractionError', 'ERRORS.GENERATION')<{
  readonly transient: boolean;
}> {}

/** Every way generating a trip can fail. */
export type GenerationFailed = GeminiSearchError | GeminiExtractionError;

/** True for a generation failure worth retrying. */
export const isTransient = (error: { readonly _tag: string }): boolean =>
  (error instanceof GeminiSearchError || error instanceof GeminiExtractionError) && error.transient;

declare module '@/features/core/error' {
  interface AppErrorRegistry {
    ai: GenerationFailed;
  }
}
