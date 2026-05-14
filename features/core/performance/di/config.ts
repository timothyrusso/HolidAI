import { ContainerModule } from 'inversify';

import { container } from '@/features/core/container';
import { NoopPerformanceTracker } from '@/features/core/performance/data/services/NoopPerformanceTracker';
import { SentryPerformanceTracker } from '@/features/core/performance/data/services/SentryPerformanceTracker';
import { PERFORMANCE_TYPES } from '@/features/core/performance/di/types';
import type { IPerformanceTracker } from '@/features/core/performance/domain/entities/services/IPerformanceTracker';
import type { ISentryPerfClient } from '@/features/core/sentry';
import { sentryClientFactory } from '@/features/core/sentry/di/factories/sentryClientFactory';

const performanceModule = new ContainerModule(({ bind }) => {
  bind<ISentryPerfClient>(PERFORMANCE_TYPES.SentryPerfClient).toConstantValue(sentryClientFactory);
  if (__DEV__) {
    bind<IPerformanceTracker>(PERFORMANCE_TYPES.PerformanceTracker).to(NoopPerformanceTracker).inSingletonScope();
  } else {
    bind<IPerformanceTracker>(PERFORMANCE_TYPES.PerformanceTracker).to(SentryPerformanceTracker).inSingletonScope();
  }
});

container.load(performanceModule);
