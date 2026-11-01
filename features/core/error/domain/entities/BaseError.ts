import { ErrorCode } from '@/features/core/error/domain/entities/ErrorCode';

/** @deprecated Night 4 shim for the features not yet on Effect (#504, #505); deleted in #505. Use a tagged error from `domain/errors/` instead. */
export class BaseError extends Error {
  public readonly context?: Record<string, unknown>;
  public readonly code: ErrorCode;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UnexpectedError,
    options?: { context?: Record<string, unknown>; cause?: Error },
  ) {
    super(message, { cause: options?.cause });
    this.name = this.constructor.name;
    this.context = options?.context;
    this.code = code;
  }
}
