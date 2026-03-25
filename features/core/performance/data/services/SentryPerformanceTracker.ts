import { inject, injectable } from 'tsyringe';

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

  startSpan<T>(options: SpanOptions, callback: () => Promise<T>): Promise<T> {
    return this.sentryClient.startSpan({ name: options.name, op: options.op }, callback);
  }

  setMeasurement(name: string, value: number, unit: MeasurementUnit): void {
    this.sentryClient.setMeasurement(name, value, unit);
  }
}
