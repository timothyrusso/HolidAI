import type { MeasurementUnit } from '@/features/core/performance/domain/entities/MeasurementUnit';
import type { SpanOptions } from '@/features/core/performance/domain/entities/SpanOptions';

export interface IPerformanceTracker {
  /**
   * Wraps an async operation in a performance span.
   * The callback is always executed regardless of the implementation.
   * Returns the result of the callback.
   */
  startSpan<T>(options: SpanOptions, callback: () => Promise<T>): Promise<T>;

  /**
   * Records a custom measurement attached to the currently active span.
   * Must be called inside a startSpan callback to be meaningful.
   */
  setMeasurement(name: string, value: number, unit: MeasurementUnit): void;
}
