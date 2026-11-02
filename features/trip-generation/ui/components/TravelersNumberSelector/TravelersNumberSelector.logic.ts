import { useTripGenerationState } from '@/features/trip-generation/state/useTripGenerationState';

const TRAVELERS_NUMBER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const useTravelersNumberSelectorLogic = () => {
  const { tripActions, tripSelectors } = useTripGenerationState();
  const travelersNumber = tripSelectors.travelersNumber();

  const options = TRAVELERS_NUMBER_OPTIONS.map(value => ({
    value,
    onPress: () => tripActions.setTravelersNumber(value),
  }));

  return {
    state: {
      travelersNumber,
    },
    derived: {
      options,
    },
  };
};
