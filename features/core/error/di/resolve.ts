import '@/features/core/error/di/config';

import { container } from '@/features/core/container';
import { ERROR_TYPES } from '@/features/core/error/di/types';
import type { ILogger } from '@/features/core/error/domain/entities/services/ILogger';

/** @deprecated Night 4 shim for the features not yet on Effect (#504, #505); deleted in #505. Use the `Logger` Tag from `@timothyrusso/effect-core`. */
export const logger = container.get<ILogger>(ERROR_TYPES.Logger);
