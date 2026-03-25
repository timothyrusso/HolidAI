import 'reflect-metadata';
import { container } from 'tsyringe';

import { NoopPerformanceTracker } from '@/features/core/performance/data/services/NoopPerformanceTracker';
import { SentryPerformanceTracker } from '@/features/core/performance/data/services/SentryPerformanceTracker';
import { PERFORMANCE_TYPES } from '@/features/core/performance/di/types';
import type { IPerformanceTracker } from '@/features/core/performance/domain/entities/services/IPerformanceTracker';
import { sentryClient } from '@/features/core/sentry';
import type { ISentryPerfClient } from '@/features/core/sentry';

container.registerInstance<ISentryPerfClient>(PERFORMANCE_TYPES.SentryPerfClient, sentryClient);

if (__DEV__) {
  container.registerSingleton<IPerformanceTracker>(PERFORMANCE_TYPES.PerformanceTracker, NoopPerformanceTracker);
} else {
  container.registerSingleton<IPerformanceTracker>(PERFORMANCE_TYPES.PerformanceTracker, SentryPerformanceTracker);
}
