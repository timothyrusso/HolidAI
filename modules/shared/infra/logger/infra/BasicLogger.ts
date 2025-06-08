import type { ILogger } from '../domain';

/**
 * The `BasicLogger` class is a logger implementation that logs messages to the console using the `console.debug`, `console.info`, `console.warn`, `console.log`, and `console.error` methods.
 * It implements the `ILogger` interface and is designed to be used as a singleton.
 */
export class BasicLogger implements ILogger {
  /**
   * Logs a debug message to the console using the `console.debug` method.
   * @param message - The debug message to be logged.
   * @param optionalParams - Optional parameters to be logged along with the message.
   */
  debug<T, O>(message: T, ...optionalParams: O[]): void {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.debug(message, ...optionalParams);
  }

  /**
   * Logs an info message to the console using the `console.info` method.
   * @param message - The info message to be logged.
   * @param optionalParams - Optional parameters to be logged along with the message.
   */
  info<T, O>(message: T, ...optionalParams: O[]): void {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.info(message, ...optionalParams);
  }

  /**
   * Logs a warning message to the console using the `console.warn` method.
   * @param message - The warning message to be logged.
   * @param optionalParams - Optional parameters to be logged along with the message.
   */
  warning<T, O>(message: T, ...optionalParams: O[]): void {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.warn(message, ...optionalParams);
  }

  /**
   * Logs a log message to the console using the `console.log` method.
   * @param message - The log message to be logged.
   * @param optionalParams - Optional parameters to be logged along with the message.
   */
  log<T, O>(message: T, ...optionalParams: O[]): void {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log(message, ...optionalParams);
  }

  /**
   * Logs an error message to the console using the `console.error` method.
   * @param error - The error object to be logged.
   * @param optionalParams - Optional parameters to be logged along with the error.
   */
  error<O>(error: Error, ...optionalParams: O[]): void {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error(error, ...optionalParams);
  }
}

export default BasicLogger;
