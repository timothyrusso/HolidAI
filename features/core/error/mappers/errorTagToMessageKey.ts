import { defineAppErrors } from '@timothyrusso/effect-core';
import type { AppError } from '@/features/core/error/appError';

const appErrors = defineAppErrors<AppError>();

/**
 * The catalog key of every error tag. A tag missing here, or a key that is not a tag, fails to
 * compile; each key equals the class's own `messageKey`, except the kit's `UnexpectedError` and
 * `ConfigError`, whose keys follow the kit's catalog convention rather than HolidAI's.
 */
export const errorTagToMessageKey = appErrors.assertExhaustiveMessageKeys({
  UnexpectedError: 'ERRORS.GENERIC',
  ConfigError: 'ERRORS.CONFIG',
  ConfigMissing: 'ERRORS.CONFIG',
  NetworkFailure: 'ERRORS.NETWORK',
  Unauthorized: 'ERRORS.UNAUTHORIZED',
  NotFound: 'ERRORS.NOT_FOUND',
  GenerationFailed: 'ERRORS.GENERATION',
  StorageFailure: 'ERRORS.STORAGE',
  ImageFetchFailed: 'ERRORS.IMAGE_FETCH',
  GeminiSearchError: 'ERRORS.GENERATION',
  GeminiExtractionError: 'ERRORS.GENERATION',
});
