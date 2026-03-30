import 'reflect-metadata';

import '@/features/core/sentry/di/config';
import { SENTRY_TYPES } from '@/features/core/sentry/di/types';
import type { ISentryErrorClient } from '@/features/core/sentry/domain/entities/services/ISentryErrorClient';
import type { ISentryPerfClient } from '@/features/core/sentry/domain/entities/services/ISentryPerfClient';
import { container } from 'tsyringe';

export const sentryClient = container.resolve<ISentryErrorClient & ISentryPerfClient>(SENTRY_TYPES.SentryClient);
