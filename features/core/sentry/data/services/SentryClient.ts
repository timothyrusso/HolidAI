import { injectable } from 'tsyringe';

import type { ISentryErrorClient } from '@/features/core/sentry/domain/entities/services/ISentryErrorClient';
import type { ISentryPerfClient } from '@/features/core/sentry/domain/entities/services/ISentryPerfClient';
import { captureException, setMeasurement, startSpan } from '@/features/core/sentry/libraries/sentryBindings';

@injectable()
export class SentryClient implements ISentryErrorClient, ISentryPerfClient {
  captureException(error: Error, context?: Record<string, unknown>): void {
    captureException(error, context);
  }

  startSpan<T>(options: { name: string; op: string }, callback: () => Promise<T>): Promise<T> {
    return startSpan(options, callback);
  }

  setMeasurement(name: string, value: number, unit: string): void {
    setMeasurement(name, value, unit);
  }
}
