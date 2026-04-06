import { createSelectors } from '@/features/core/state/libraries/createSelectors';
import { registerStore } from '@/features/core/state/libraries/createStore';
import { createZustandStorage } from '@/features/core/state/libraries/createZustandStorage';
import type { IStorage } from '@/features/core/storage';
import { storage as defaultStorage } from '@/features/core/storage';
import { TranslationKeys } from '@/features/core/translations';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export type AppState = {
  language: string;
  loading: boolean;
};

export type AppActions = {
  actions: {
    setLanguage: (language: string) => void;
    setLoading: (loading: boolean) => void;
    resetAppState: () => void;
  };
};

const initialState: AppState = {
  language: TranslationKeys.defaultLanguage,
  loading: false,
};

export const createAppStore = (storageClient: IStorage = defaultStorage) =>
  createWithEqualityFn<AppState & AppActions>()(
    persist(
      set => ({
        ...initialState,
        actions: {
          setLanguage: language => set({ language }),
          setLoading: loading => set({ loading }),
          resetAppState: () => set(initialState),
        },
      }),
      {
        name: 'app-store',
        version: 1,
        migrate: persistedState => ({
          language: (persistedState as Partial<AppState>)?.language ?? initialState.language,
        }),
        storage: createZustandStorage(storageClient),
        partialize: ({ language }) => ({ language }),
      },
    ),
    shallow,
  );

export const useAppStore = createAppStore();
export const appStoreSelectors = createSelectors(useAppStore);
registerStore(useAppStore);
