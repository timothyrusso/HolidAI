import 'reflect-metadata';

import { container } from '@/di/config';
import { TYPES } from '@/di/types';
import type { IAiClient } from '@/modules/shared/infra/ai';

export const aiClient = container.resolve<IAiClient>(TYPES.AiClient);
