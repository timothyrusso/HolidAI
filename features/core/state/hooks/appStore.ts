import { create } from '@/features/core/state/libraries/createStore';
import { TranslationKeys } from '@/features/core/translations';

export type AppState = {
  language: string;
  loading: boolean;
};

export type AppActions = {
  actions: {
    setLanguage: (value: string) => void;
    setLoading: (value: boolean) => void;
    resetAppState: () => void;
  };
};

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
