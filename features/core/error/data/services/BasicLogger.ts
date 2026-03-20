import type { ILogger } from '@/features/core/error/domain/entities/services/ILogger';

export class BasicLogger implements ILogger {
  debug(message: string, ...args: unknown[]): void {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.debug(message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.info(message, ...args);
  }

  warning(message: string, ...args: unknown[]): void {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.warn(message, ...args);
  }

  log(message: string, ...args: unknown[]): void {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log(message, ...args);
  }

  error(error: Error, context?: Record<string, unknown>): void {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error(error, context);
  }
}
