import 'reflect-metadata';
import './config';

import type { ILogger } from '@/features/core/error/domain/entities/services/ILogger';
import { container } from 'tsyringe';
import { ERROR_TYPES } from './types';

export const logger = container.resolve<ILogger>(ERROR_TYPES.Logger);
