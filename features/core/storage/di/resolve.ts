import 'reflect-metadata';

import '@/features/core/storage/di/config';
import { STORAGE_TYPES } from '@/features/core/storage/di/types';
import type { IStorage } from '@/features/core/storage/domain/entities/IStorage';
import { container } from 'tsyringe';

export const storage = container.resolve<IStorage>(STORAGE_TYPES.Storage);
