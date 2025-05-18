import 'reflect-metadata';

import { container } from '@/di/config';
import { TYPES } from '@/di/types';
import type { IStorage } from '@/modules/shared/infra/storage';

export const storage = container.resolve<IStorage>(TYPES.Storage);
