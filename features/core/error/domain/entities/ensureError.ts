import { BaseError } from './BaseError';
import { ErrorCode } from './ErrorCode';

export const ensureError = (value: unknown): BaseError => {
  if (value instanceof BaseError) return value;
  if (value instanceof Error) return new BaseError(value.message, ErrorCode.UnexpectedError, { cause: value });
  return new BaseError(String(value), ErrorCode.UnexpectedError);
};
