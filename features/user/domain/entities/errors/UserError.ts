import { BaseError, ErrorCode } from '@/features/core/error';

export class UserError extends BaseError {
  constructor(message: string, cause?: Error) {
    super(message, ErrorCode.Unknown, { cause });
  }
}
