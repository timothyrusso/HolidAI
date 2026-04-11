import { tripGenerationStoreSelectors } from '@/features/trip-generation/state/tripGenerationStore';

export const useTripGenerationState = () => {
  const { actions, ...tripSelectors } = tripGenerationStoreSelectors.use;

  return {
    tripActions: actions(),
    tripSelectors,
  };
};
