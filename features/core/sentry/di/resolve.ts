import '@/features/core/sentry/di/config';

import { container } from '@/di/container';
import { SENTRY_TYPES } from '@/features/core/sentry/di/types';
import type { ISentryErrorClient } from '@/features/core/sentry/domain/entities/services/ISentryErrorClient';
import type { ISentryPerfClient } from '@/features/core/sentry/domain/entities/services/ISentryPerfClient';

export const sentryClient = container.get<ISentryErrorClient & ISentryPerfClient>(SENTRY_TYPES.SentryClient);
