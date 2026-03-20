import type { ILogger } from '@/features/core/error/domain/entities/services/ILogger';
import { sentryClient } from '@/features/core/error/libraries/sentryClient';

export class SentryLogger implements ILogger {
  error(error: Error, context?: Record<string, unknown>): void {
    sentryClient.captureException(error, context);
  }

  log(_message: string): void {
    /* no-op in production */
  }
  warning(_message: string): void {
    /* no-op in production */
  }
  info(_message: string): void {
    /* no-op in production */
  }
  debug(_message: string): void {
    /* no-op in production */
  }
}
