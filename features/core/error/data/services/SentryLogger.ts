import { inject, injectable } from 'inversify';

import { ERROR_TYPES } from '@/features/core/error/di/types';
import type { ILogger } from '@/features/core/error/domain/entities/services/ILogger';
import type { ISentryErrorClient } from '@/features/core/sentry';

/**
 * Production logger implementation that forwards errors to Sentry.
 * Registered in the IoC container for production environments.
 * Only `error()` is active — all other log levels are no-ops to avoid
 * sending noise to Sentry in production.
 */
@injectable()
export class SentryLogger implements ILogger {
  constructor(@inject(ERROR_TYPES.SentryErrorClient) private readonly sentryClient: ISentryErrorClient) {}

  /** Captures the error as a Sentry exception with optional context metadata. */
  error(error: Error, context?: Record<string, unknown>): void {
    this.sentryClient.captureException(error, context);
  }

  /** No-op in production — informational logs are not forwarded to Sentry. */
  log(_message: string): void {
    /* no-op in production */
  }

  /** No-op in production — warnings are not forwarded to Sentry. */
  warning(_message: string): void {
    /* no-op in production */
  }

  /** No-op in production — info messages are not forwarded to Sentry. */
  info(_message: string): void {
    /* no-op in production */
  }

  /** No-op in production — debug messages are not forwarded to Sentry. */
  debug(_message: string): void {
    /* no-op in production */
  }
}
