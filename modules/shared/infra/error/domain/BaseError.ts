import { ErrorCode } from './ErrorCode';
import type { Jsonable } from './Jsonable';

/**
 * Custom error class that extends the built-in Error class.
 * Allows for the creation of error objects with additional context information in the form of JSON data.
 */
export class BaseError extends Error {
  /**
   * Additional context information associated with the error object.
   * Can be any JSON-serializable value, such as a string, number, boolean, array, object, or null.
   */
  public readonly context?: Jsonable;

  /**
   * The `cause` property is re-declared to avoid TypeScript errors when trying to access it.
   */
  public readonly cause?: unknown;

  /**
   * The internal `code` to uniquely identify the error code
   */
  public readonly code: ErrorCode | number | string;

  /**
   * Constructor method of the BaseError class.
   * @param message - The error message.
   * @param code - The error code used to identify the kind of error, defaults to ErrorCode.UnexpectedError.
   * @param options - Optional options object.
   * @param options.cause - An instance of the Error class representing the cause of the error.
   * @param options.context - JSON data representing additional context information.
   */
  constructor(
    message: string,
    code?: ErrorCode | number | string,
    options: { cause?: Error; context?: Jsonable } = {},
  ) {
    const { cause, context } = options;

    super(message);
    this.name = this.constructor.name;

    if (cause) this.cause = cause;

    this.context = context;

    this.code = code ?? ErrorCode.UnexpectedError;
  }
}
