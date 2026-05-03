import type { Result } from '@/features/core/error';

export interface IStorage {
  set: (key: string, value: boolean | string | number | Uint8Array) => void;
  setObj: <T>(key: string, value: T) => void;
  getString: (key: string) => string | undefined;
  getBoolean: (key: string) => boolean | undefined;
  getNumber: (key: string) => number | undefined;
  getObj: <T>(key: string) => Result<T | undefined>;
  getBuffer: (key: string) => ArrayBufferLike | undefined;
  getStore: <T>(key: string) => T | null;
  exist: (key: string) => boolean;
  getAllKeys: () => Array<string>;
  delete: (key: string) => void;
  clearAll: () => void;
  encrypt: (key: string) => void;
  removeEnc: () => void;
}
