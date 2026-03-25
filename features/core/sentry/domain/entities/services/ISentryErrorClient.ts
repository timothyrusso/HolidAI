export interface ISentryErrorClient {
  captureException(error: Error, context?: Record<string, unknown>): void;
}
