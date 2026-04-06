import { tripStoreSelectors } from './tripStore';

const { actions, ...tripSelectors } = tripStoreSelectors.use;

export const useTripState = () => ({
  tripActions: actions(),
  tripSelectors,
});
