import type { MMKV } from 'react-native-mmkv';
import { inject } from 'tsyringe';

import { type Result, ensureError, fail, ok } from '@/features/core/error';
import { STORAGE_TYPES } from '@/features/core/storage/di/types';
import type { IStorage } from '@/features/core/storage/domain/entities/IStorage';

/**
 * MMKV-backed implementation of {@link IStorage}.
 * Persists data synchronously on-device using the MMKV storage engine.
 * The MMKV instance is injected via the IoC container — swapping the storage
 * library only requires updating `di/factories/` and `di/config.ts`.
 */
export class LocalStorage implements IStorage {
  constructor(@inject(STORAGE_TYPES.MMKV) private storage: MMKV) {}

  /** Stores a primitive value. `Uint8Array` is written as a raw `ArrayBuffer`. */
  set(key: string, value: boolean | string | number | Uint8Array): void {
    if (value instanceof Uint8Array) {
      this.storage.set(key, value.buffer as ArrayBuffer);
    } else {
      this.storage.set(key, value);
    }
  }

  /** Serialises `value` to JSON and stores it under `key`. */
  setObj<T>(key: string, value: T): void {
    this.storage.set(key, JSON.stringify(value));
  }

  /** Returns the string stored under `key`, or `undefined` if absent. */
  getString(key: string): string | undefined {
    return this.storage.getString(key);
  }

  /** Returns the boolean stored under `key`, or `undefined` if absent. */
  getBoolean(key: string): boolean | undefined {
    return this.storage.getBoolean(key);
  }

  /** Returns the number stored under `key`, or `undefined` if absent. */
  getNumber(key: string): number | undefined {
    return this.storage.getNumber(key);
  }

  /**
   * Deserialises the JSON string stored under `key` into `T`.
   * Returns `ok(undefined)` if the key is absent.
   * Returns `fail(BaseError)` if the stored value is not valid JSON —
   * ensures a corrupted entry never propagates a thrown exception to the caller.
   */
  getObj<T>(key: string): Result<T | undefined> {
    const obj = this.storage.getString(key);
    if (!obj) return ok(undefined);
    try {
      return ok(JSON.parse(obj) as T);
    } catch (err) {
      return fail(ensureError(err));
    }
  }

  /**
   * Returns the raw `ArrayBuffer` stored under `key`, or `undefined` if absent.
   * Use in conjunction with `set` when storing `Uint8Array` binary data
   * (e.g. cryptographic keys, protobuf payloads).
   */
  getBuffer(key: string): ArrayBufferLike | undefined {
    return this.storage.getBuffer(key);
  }

  /** Returns `true` if a value exists under `key`. */
  exist(key: string): boolean {
    return this.storage.contains(key);
  }

  /** Returns all keys currently stored in the MMKV instance. */
  getAllKeys(): string[] {
    return this.storage.getAllKeys();
  }

  /** Deletes the value stored under `key`. */
  delete(key: string): void {
    this.storage.delete(key);
  }

  /** Deletes all keys and values from the MMKV instance. */
  clearAll(): void {
    this.storage.clearAll();
  }

  /** Re-encrypts the storage with the provided `key`. */
  encrypt(key: string): void {
    this.storage.recrypt(key);
  }

  /** Removes encryption from the storage. */
  removeEnc(): void {
    this.storage.recrypt(undefined);
  }

  /**
   * Reads a Zustand persisted store slice from storage.
   * Expects the stored value to have the shape `{ state: T }` as written by the Zustand persist middleware.
   * Returns `null` if the key does not exist or if JSON deserialisation fails.
   * Callers that need to distinguish between "absent" and "corrupted" should use {@link getObj} directly.
   */
  getStore<T>(key: string): T | null {
    if (!this.exist(key)) return null;
    const result = this.getObj<{ state: T }>(key);
    if (!result.success) return null;
    return result.data?.state ?? null;
  }
}
