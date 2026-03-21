import type { ILogger } from '@/features/core/error/domain/entities/services/ILogger';

/**
 * Development logger implementation that writes all log levels to the native console.
 * Registered in the IoC container for non-production environments.
 * In production, {@link SentryLogger} is used instead.
 */
export class BasicLogger implements ILogger {
  /** Writes a debug-level message to `console.debug`. */
  debug(message: string, ...args: unknown[]): void {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.debug(message, ...args);
  }

  /** Writes an info-level message to `console.info`. */
  info(message: string, ...args: unknown[]): void {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.info(message, ...args);
  }

  /** Writes a warning-level message to `console.warn`. */
  warning(message: string, ...args: unknown[]): void {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.warn(message, ...args);
  }

  /** Writes a log-level message to `console.log`. */
  log(message: string, ...args: unknown[]): void {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log(message, ...args);
  }

  /** Writes an error and optional context to `console.error`. */
  error(error: Error, context?: Record<string, unknown>): void {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error(error, context);
  }
}
