import { appStoreSelectors } from '@/features/core/state/app/appStore';

export const useAppState = () => {
  const { actions, ...appSelectors } = appStoreSelectors.use;

  const appActions = actions();

  return {
    loading: appSelectors.loading(),
    setAppLoading: appActions.setLoading,
    appActions,
    appSelectors,
  };
};
