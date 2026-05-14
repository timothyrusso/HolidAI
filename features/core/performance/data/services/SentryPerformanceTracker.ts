import { inject, injectable } from 'inversify';

import { PERFORMANCE_TYPES } from '@/features/core/performance/di/types';
import type { MeasurementUnit } from '@/features/core/performance/domain/entities/MeasurementUnit';
import type { SpanOptions } from '@/features/core/performance/domain/entities/SpanOptions';
import type { IPerformanceTracker } from '@/features/core/performance/domain/entities/services/IPerformanceTracker';
import type { ISentryPerfClient } from '@/features/core/sentry';

/**
 * Production performance tracker that forwards spans and measurements to Sentry.
 * Registered in the IoC container for production environments.
 */
@injectable()
export class SentryPerformanceTracker implements IPerformanceTracker {
  constructor(@inject(PERFORMANCE_TYPES.SentryPerfClient) private readonly sentryClient: ISentryPerfClient) {}

  /**
   * Wraps an async operation in a Sentry performance span.
   *
   * Nested calls will appear as child spans in the Sentry trace view,
   * allowing per-step timing within a parent operation.
   *
   * @param options - Span descriptor. See {@link SpanOptions}.
   * @param callback - The async operation to measure.
   * @returns The result of the callback.
   */
  startSpan<T>(options: SpanOptions, callback: () => Promise<T>): Promise<T> {
    return this.sentryClient.startSpan({ name: options.name, op: options.op }, callback);
  }

  /**
   * Records a custom measurement on the currently active Sentry span.
   *
   * @param name - Measurement key (e.g. `'ai.tokens.input'`).
   * @param value - Numeric value to record.
   * @param unit - Unit of the measurement. Use a value from {@link MeasurementUnit}.
   */
  setMeasurement(name: string, value: number, unit: MeasurementUnit): void {
    this.sentryClient.setMeasurement(name, value, unit);
  }
}
