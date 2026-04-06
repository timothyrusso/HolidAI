import { tripStoreSelectors } from './tripStore';

export const useTripState = () => {
  const { actions, ...tripSelectors } = tripStoreSelectors.use;

  return {
    tripActions: actions(),
    tripSelectors: { ...tripSelectors },
  };
};
