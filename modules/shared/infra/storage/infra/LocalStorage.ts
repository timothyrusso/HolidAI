import type { MMKV } from 'react-native-mmkv';
import { inject, singleton } from 'tsyringe';

import { TYPES } from '@/di/types';
import type { IStorage } from '@/modules/shared/infra/storage';
import type { ILogger } from '../../logger';

/**
 * The `LocalStorage` class is an implementation of the `IStorage` interface.
 * It provides methods for storing and retrieving data using the `MMKV` library.
 * It also includes error handling and logging functionalities.
 */
@singleton()
export class LocalStorage implements IStorage {
  /**
   * Creates an instance of `LocalStorage`.
   * @param storage The instance of the `MMKV` class used for storing and retrieving data.
   * @param logger The instance of the `ILogger` class used for logging errors.
   */
  constructor(
    @inject(TYPES.MMKV) private storage: MMKV,
    @inject(TYPES.Logger) private logger: ILogger,
  ) {}

  /**
   * Sets a value for the given key.
   * @param key The key to set.
   * @param value The value to set.
   */
  set(key: string, value: boolean | string | number | Uint8Array): void {
    this.storage.set(key, value);
  }

  /**
   * Serializes and sets an object value for the given key.
   * @param key The key to set.
   * @param value The object value to set.
   */
  setObj<T>(key: string, value: T): void {
    this.storage.set(key, JSON.stringify(value));
  }

  /**
   * Retrieves a string value for the given key.
   * @param key The key to retrieve.
   * @returns The string value for the given key.
   */
  getString(key: string): string | undefined {
    return this.storage.getString(key);
  }

  /**
   * Retrieves a boolean value for the given key.
   * @param key The key to retrieve.
   * @returns The boolean value for the given key.
   */
  getBoolean(key: string): boolean | undefined {
    return this.storage.getBoolean(key);
  }

  /**
   * Retrieves a number value for the given key.
   * @param key The key to retrieve.
   * @returns The number value for the given key.
   */
  getNumber(key: string): number | undefined {
    return this.storage.getNumber(key);
  }

  /**
   * Retrieves and deserializes an object value for the given key.
   * @param key The key to retrieve.
   * @returns The deserialized object value for the given key.
   */
  getObj<T>(key: string): T | undefined {
    const obj = this.storage.getString(key);
    return obj ? JSON.parse(obj) : undefined;
  }

  /**
   * Checks if a key exists.
   * @param key The key to check.
   * @returns True if the key exists, false otherwise.
   */
  exist(key: string): boolean {
    return this.storage.contains(key);
  }

  /**
   * Retrieves all keys.
   * @returns An array of all keys.
   */
  getAllKeys(): string[] {
    return this.storage.getAllKeys();
  }

  /**
   * Deletes a key.
   * @param key The key to delete.
   */
  delete(key: string): void {
    this.storage.delete(key);
  }

  /**
   * Clears all keys.
   */
  clearAll(): void {
    this.storage.clearAll();
  }

  /**
   * Encrypts data for the given key.
   * @param key The key to encrypt.
   */
  encrypt(key: string): void {
    this.storage.recrypt(key);
  }

  /**
   * Decrypts data.
   */
  removeEnc(): void {
    this.storage.recrypt(undefined);
  }

  /**
   * Retrieves and deserializes an object value for the given key, with error handling and logging.
   * @param key The key to retrieve.
   * @returns The deserialized object value for the given key, or null if an error occurred.
   */
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
