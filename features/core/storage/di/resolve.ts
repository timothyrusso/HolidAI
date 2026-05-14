import '@/features/core/storage/di/config';

import { container } from '@/di/container';
import { STORAGE_TYPES } from '@/features/core/storage/di/types';
import type { IStorage } from '@/features/core/storage/domain/entities/IStorage';

export const storage = container.get<IStorage>(STORAGE_TYPES.Storage);
