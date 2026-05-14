import { ContainerModule } from 'inversify';

import { container } from '@/features/core/container';
import { BasicLogger } from '@/features/core/error/data/services/BasicLogger';
import { SentryLogger } from '@/features/core/error/data/services/SentryLogger';
import { ERROR_TYPES } from '@/features/core/error/di/types';
import type { ILogger } from '@/features/core/error/domain/entities/services/ILogger';
import type { ISentryErrorClient } from '@/features/core/sentry';
import { sentryClientFactory } from '@/features/core/sentry/di/factories/sentryClientFactory';

const errorModule = new ContainerModule(({ bind }) => {
  bind<ISentryErrorClient>(ERROR_TYPES.SentryErrorClient).toConstantValue(sentryClientFactory);
  if (__DEV__) {
    bind<ILogger>(ERROR_TYPES.Logger).to(BasicLogger).inSingletonScope();
  } else {
    bind<ILogger>(ERROR_TYPES.Logger).to(SentryLogger).inSingletonScope();
  }
});

container.load(errorModule);
