import { TYPES } from '@/di/types';
import type { IStorage } from '@/modules/shared/infra/storage';
import { LocalStorage } from '@/modules/shared/infra/storage/infra/LocalStorage';
import { container } from 'tsyringe';

container.registerSingleton<IStorage>(TYPES.Storage, LocalStorage);
