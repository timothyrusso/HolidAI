import { BaseError, ErrorCode } from '@/features/core/error';

export class TripError extends BaseError {
  constructor(message: string, cause?: Error) {
    super(message, ErrorCode.Unknown, { cause });
  }
}
