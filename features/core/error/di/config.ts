import 'reflect-metadata';
import { container } from 'tsyringe';

import { BasicLogger } from '@/features/core/error/data/services/BasicLogger';
import { SentryLogger } from '@/features/core/error/data/services/SentryLogger';
import { ERROR_TYPES } from '@/features/core/error/di/types';
import type { ILogger } from '@/features/core/error/domain/entities/services/ILogger';
import { sentryClient } from '@/features/core/sentry';
import type { ISentryErrorClient } from '@/features/core/sentry';

container.registerInstance<ISentryErrorClient>(ERROR_TYPES.SentryErrorClient, sentryClient);

if (__DEV__) {
  container.registerSingleton<ILogger>(ERROR_TYPES.Logger, BasicLogger);
} else {
  container.registerSingleton<ILogger>(ERROR_TYPES.Logger, SentryLogger);
}
