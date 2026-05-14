import { ContainerModule } from 'inversify';
import type { MMKV } from 'react-native-mmkv';

import { container } from '@/di/container';
import { LocalStorage } from '@/features/core/storage/data/services/LocalStorage';
import { mmkvClient } from '@/features/core/storage/di/factories/mmkvClient';
import { STORAGE_TYPES } from '@/features/core/storage/di/types';
import type { IStorage } from '@/features/core/storage/domain/entities/IStorage';

const storageModule = new ContainerModule(({ bind }) => {
  bind<MMKV>(STORAGE_TYPES.MMKV).toConstantValue(mmkvClient);
  bind<IStorage>(STORAGE_TYPES.Storage).to(LocalStorage).inSingletonScope();
});

container.load(storageModule);
