import { BaseError } from '@/features/core/error/domain/entities/BaseError';
import { ErrorCode } from '@/features/core/error/domain/entities/ErrorCode';

export const ensureError = (value: unknown): BaseError => {
  if (value instanceof BaseError) return value;
  if (value instanceof Error) return new BaseError(value.message, ErrorCode.UnexpectedError, { cause: value });

  let message: string;
  let context: Record<string, unknown> | undefined;

  if (typeof value === 'string') {
    message = value;
  } else {
    message = 'An unknown error occurred';
    try {
      context = { raw: JSON.stringify(value) };
    } catch {
      context = { raw: String(value) };
    }
  }

  return new BaseError(message, ErrorCode.UnexpectedError, { context });
};
