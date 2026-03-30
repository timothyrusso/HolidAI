import 'reflect-metadata';

import { LocalStorage } from '@/features/core/storage/data/services/LocalStorage';
import { mmkvClient } from '@/features/core/storage/di/factories/mmkvClient';
import { STORAGE_TYPES } from '@/features/core/storage/di/types';
import type { IStorage } from '@/features/core/storage/domain/entities/IStorage';
import type { MMKV } from 'react-native-mmkv';
import { container } from 'tsyringe';

container.registerInstance<MMKV>(STORAGE_TYPES.MMKV, mmkvClient);
container.registerSingleton<IStorage>(STORAGE_TYPES.Storage, LocalStorage);
