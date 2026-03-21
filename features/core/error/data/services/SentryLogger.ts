import type { ILogger } from '@/features/core/error/domain/entities/services/ILogger';
import { sentryClient } from '@/features/core/error/libraries/sentryClient';

/**
 * Production logger implementation that forwards errors to Sentry.
 * Registered in the IoC container for production environments.
 * Only `error()` is active — all other log levels are no-ops to avoid
 * sending noise to Sentry in production.
 */
export class SentryLogger implements ILogger {
  /** Captures the error as a Sentry exception with optional context metadata. */
  error(error: Error, context?: Record<string, unknown>): void {
    sentryClient.captureException(error, context);
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
