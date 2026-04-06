import { createSelectors } from '@/features/core/state';
import { useTripStore } from './tripStore';

export const useTripState = () => {
  const tripStore = createSelectors(useTripStore);

  const { actions, ...tripSelectors } = tripStore.use;

  return {
    tripActions: actions(),
    tripSelectors: { ...tripSelectors },
  };
};
