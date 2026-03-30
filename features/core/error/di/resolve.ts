import 'reflect-metadata';

import '@/features/core/error/di/config';
import { ERROR_TYPES } from '@/features/core/error/di/types';
import type { ILogger } from '@/features/core/error/domain/entities/services/ILogger';
import { container } from 'tsyringe';

export const logger = container.resolve<ILogger>(ERROR_TYPES.Logger);
