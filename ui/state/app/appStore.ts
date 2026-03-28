import { TranslationKeys } from '@/features/core/translations';
import { create } from '../shared/createStore';
import type { AppActions, AppState } from './types';

const initialState: AppState = {
  language: TranslationKeys.defaultLanguage,
  loading: false,
};

export const useAppStore = create<AppState & AppActions>()(set => ({
  ...initialState,
  actions: {
    setLanguage: language => set({ language }),
    setLoading: loading => set({ loading }),
    resetAppState: () => set(initialState),
  },
}));
