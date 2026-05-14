import { ContainerModule } from 'inversify';

import { container } from '@/di/container';
import type { SentryClient } from '@/features/core/sentry/data/services/SentryClient';
import { sentryClientFactory } from '@/features/core/sentry/di/factories/sentryClientFactory';
import { SENTRY_TYPES } from '@/features/core/sentry/di/types';

const sentryModule = new ContainerModule(({ bind }) => {
  bind<SentryClient>(SENTRY_TYPES.SentryClient).toConstantValue(sentryClientFactory);
});

container.load(sentryModule);
