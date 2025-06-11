import { BaseError, ErrorCode } from '../domain';

/**
 * Converts an unknown value into a BaseError object.
 * If the value is already an instance of BaseError, it is returned as is.
 * If the value is already an instance of Error, return a new BaseError instance where
 * the cause is the value to convert.
 * Otherwise, return a BaseError with generic error messaged.
 * @param value - The value to be checked and converted into an BaseError object.
 * @returns The converted BaseError object.
 */
export function ensureError(value: unknown): BaseError {
  if (value instanceof BaseError) {
    return value;
  }

  if (value instanceof Error) {
    return new BaseError(value.message, ErrorCode.UnexpectedError, {
      cause: value,
    });
  }

  return new BaseError('Value is not an Error nor a BaseError');
}
