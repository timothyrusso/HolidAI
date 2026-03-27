import 'reflect-metadata';
import { container } from 'tsyringe';

import { SentryClient } from '@/features/core/sentry/data/services/SentryClient';
import { SENTRY_TYPES } from '@/features/core/sentry/di/types';

container.registerSingleton<SentryClient>(SENTRY_TYPES.SentryClient, SentryClient);
