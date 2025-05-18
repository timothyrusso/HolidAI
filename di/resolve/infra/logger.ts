import 'reflect-metadata';

import { container } from '@/di/config';
import { TYPES } from '@/di/types';
import type { ILogger } from '@/modules/shared/infra/logger';

export const logger = container.resolve<ILogger>(TYPES.Logger);
