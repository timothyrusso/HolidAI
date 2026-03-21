import 'reflect-metadata';
import { BasicLogger } from '@/features/core/error/data/services/BasicLogger';
import { SentryLogger } from '@/features/core/error/data/services/SentryLogger';
import type { ILogger } from '@/features/core/error/domain/entities/services/ILogger';
import { container } from 'tsyringe';
import { ERROR_TYPES } from './types';

if (__DEV__) {
  container.registerSingleton<ILogger>(ERROR_TYPES.Logger, BasicLogger);
} else {
  container.registerSingleton<ILogger>(ERROR_TYPES.Logger, SentryLogger);
}
