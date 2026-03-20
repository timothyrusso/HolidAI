export interface ILogger {
  log(message: string, ...args: unknown[]): void;
  error(error: Error, context?: Record<string, unknown>): void;
  warning(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
}
