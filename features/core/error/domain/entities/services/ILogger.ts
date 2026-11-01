/** @deprecated Night 4 shim for the features not yet on Effect (#504, #505); deleted in #505. Use the `Logger` Tag from `@timothyrusso/effect-core`. */
export interface ILogger {
  log(message: string, ...args: unknown[]): void;
  error(error: Error, context?: Record<string, unknown>): void;
  warning(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
}
