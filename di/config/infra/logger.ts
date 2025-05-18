import { TYPES } from '@/di/types';
import { BasicLogger, type ILogger } from '@/modules/shared/infra/logger';
import { container } from 'tsyringe';

container.registerSingleton<ILogger>(TYPES.Logger, BasicLogger);
