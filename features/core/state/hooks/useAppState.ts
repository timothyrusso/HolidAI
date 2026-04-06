import { useAppStore } from '@/features/core/state/hooks/appStore';
import { createSelectors } from '@/features/core/state/libraries/createSelectors';

export const useAppState = () => {
  const appStore = createSelectors(useAppStore);

  const { actions, ...appSelectors } = appStore.use;

  const appActions = actions();

  return {
    loading: appSelectors.loading(),
    setAppLoading: appActions.setLoading,
    appActions,
    appSelectors: { ...appSelectors },
  };
};
