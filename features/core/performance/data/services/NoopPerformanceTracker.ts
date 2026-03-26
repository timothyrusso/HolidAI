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
  /**
   * Executes the callback directly without creating a span.
   *
   * @param _options - Ignored in development.
   * @param callback - The async operation to execute.
   * @returns The result of the callback.
   */
  startSpan<T>(_options: SpanOptions, callback: () => Promise<T>): Promise<T> {
    return callback();
  }

  /**
   * No-op in development — measurements are not recorded.
   *
   * @param _name - Ignored.
   * @param _value - Ignored.
   * @param _unit - Ignored.
   */
  setMeasurement(_name: string, _value: number, _unit: MeasurementUnit): void {}
}
