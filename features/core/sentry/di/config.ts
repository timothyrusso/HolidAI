import 'reflect-metadata';

import { SentryClient } from '@/features/core/sentry/data/services/SentryClient';
import { SENTRY_TYPES } from '@/features/core/sentry/di/types';
import { container } from 'tsyringe';

container.registerSingleton<SentryClient>(SENTRY_TYPES.SentryClient, SentryClient);
