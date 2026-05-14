import '@/features/core/error/di/config';

import { container } from '@/di/container';
import { ERROR_TYPES } from '@/features/core/error/di/types';
import type { ILogger } from '@/features/core/error/domain/entities/services/ILogger';

export const logger = container.get<ILogger>(ERROR_TYPES.Logger);
