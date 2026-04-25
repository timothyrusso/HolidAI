import { BaseError, ErrorCode } from '@/features/core/error';

export class GeminiExtractionError extends BaseError {
  constructor(message: string, cause?: Error) {
    super(message, ErrorCode.GenerationFailed, { cause });
  }
}
