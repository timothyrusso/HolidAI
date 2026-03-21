import type { MMKV } from 'react-native-mmkv';
import { inject, singleton } from 'tsyringe';

import { type ILogger, ensureError } from '@/features/core/error';
import { ERROR_TYPES } from '@/features/core/error/di/types';
import { STORAGE_TYPES } from '@/features/core/storage/di/types';
import type { IStorage } from '@/features/core/storage/domain/entities/IStorage';

@singleton()
export class LocalStorage implements IStorage {
  constructor(
    @inject(ERROR_TYPES.Logger) private logger: ILogger,
    @inject(STORAGE_TYPES.MMKV) private storage: MMKV,
  ) {}

  set(key: string, value: boolean | string | number | Uint8Array): void {
    if (value instanceof Uint8Array) {
      this.storage.set(key, value.buffer as ArrayBuffer);
    } else {
      this.storage.set(key, value);
    }
  }

  setObj<T>(key: string, value: T): void {
    this.storage.set(key, JSON.stringify(value));
  }

  getString(key: string): string | undefined {
    return this.storage.getString(key);
  }

  getBoolean(key: string): boolean | undefined {
    return this.storage.getBoolean(key);
  }

  getNumber(key: string): number | undefined {
    return this.storage.getNumber(key);
  }

  getObj<T>(key: string): T | undefined {
    const obj = this.storage.getString(key);
    return obj ? JSON.parse(obj) : undefined;
  }

  exist(key: string): boolean {
    return this.storage.contains(key);
  }

  getAllKeys(): string[] {
    return this.storage.getAllKeys();
  }

  delete(key: string): void {
    this.storage.delete(key);
  }

  clearAll(): void {
    this.storage.clearAll();
  }

  encrypt(key: string): void {
    this.storage.recrypt(key);
  }

  removeEnc(): void {
    this.storage.recrypt(undefined);
  }

  getStore<T>(key: string): T | null {
    try {
      const exist = this.exist(key);
      if (!exist) return null;

      const storage = this.getObj<{ state: T }>(key);
      return storage?.state ?? null;
    } catch (err) {
      const error = ensureError(err);
      this.logger.error(error);
      return null;
    }
  }
}
