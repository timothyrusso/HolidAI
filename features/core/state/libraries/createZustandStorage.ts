import type { IStorage } from '@/features/core/storage';
import { createJSONStorage } from 'zustand/middleware';

/**
 * Adapts {@link IStorage} to the interface expected by Zustand's persist middleware.
 * IStorage uses domain-oriented method names (getString / set / delete) that don't
 * match Zustand's StateStorage contract (getItem / setItem / removeItem) — this
 * bridges the gap without requiring any changes to either side.
 */
export const createZustandStorage = (storage: IStorage) =>
  createJSONStorage(() => ({
    getItem: key => storage.getString(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key),
  }));
