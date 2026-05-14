import { injectable } from 'inversify';

import type { ISentryErrorClient } from '@/features/core/sentry/domain/entities/services/ISentryErrorClient';
import type { ISentryPerfClient } from '@/features/core/sentry/domain/entities/services/ISentryPerfClient';
import { captureException, setMeasurement, startSpan } from '@/features/core/sentry/libraries/sentryBindings';

@injectable()
export class SentryClient implements ISentryErrorClient, ISentryPerfClient {
  /**
   * Captures an exception and sends it to Sentry with optional additional context.
   *
   * @param error - The error to report.
   * @param context - Optional key-value pairs attached to the event as extra data.
   */
  captureException(error: Error, context?: Record<string, unknown>): void {
    captureException(error, context);
  }

  /**
   * Wraps an async operation in a Sentry performance span.
   *
   * The span is automatically finished when the callback resolves or rejects,
   * and nested spans will appear as children in the Sentry trace view.
   *
   * @param options - Span descriptor containing `name` (human-readable label) and `op` (operation category).
   * @param callback - The async operation to measure.
   * @returns The result of the callback.
   */
  startSpan<T>(options: { name: string; op: string }, callback: () => Promise<T>): Promise<T> {
    return startSpan(options, callback);
  }

  /**
   * Records a custom measurement on the currently active span.
   *
   * @param name - Measurement key (e.g. `'ai.tokens.input'`).
   * @param value - Numeric value to record.
   * @param unit - Unit string (e.g. `'millisecond'`, `'none'`). Accepts any `MeasurementUnit` value.
   */
  setMeasurement(name: string, value: number, unit: string): void {
    setMeasurement(name, value, unit);
  }
}
