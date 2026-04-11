import { BaseError, ErrorCode } from '@/features/core/error';

export class GeminiSearchError extends BaseError {
  constructor(message: string, cause?: Error) {
    super(message, ErrorCode.GenerationFailed, { cause });
  }
}
