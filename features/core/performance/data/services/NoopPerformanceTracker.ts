import { injectable } from 'tsyringe';

import type { MeasurementUnit } from '@/features/core/performance/domain/entities/MeasurementUnit';
import type { SpanOptions } from '@/features/core/performance/domain/entities/SpanOptions';
import type { IPerformanceTracker } from '@/features/core/performance/domain/entities/services/IPerformanceTracker';

/**
 * Development performance tracker that executes the callback without sending
 * any data to Sentry. Registered in the IoC container for development environments.
 */
@injectable()
export class NoopPerformanceTracker implements IPerformanceTracker {
  startSpan<T>(_options: SpanOptions, callback: () => Promise<T>): Promise<T> {
    return callback();
  }

  setMeasurement(_name: string, _value: number, _unit: MeasurementUnit): void {
    /* no-op in development */
  }
}
