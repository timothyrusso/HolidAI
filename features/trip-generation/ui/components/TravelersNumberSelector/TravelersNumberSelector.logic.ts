import { useTripGenerationState } from '@/features/trip-generation/state/useTripGenerationState';

const TRAVELERS_NUMBER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const useTravelersNumberSelectorLogic = () => {
  const { tripActions, tripSelectors } = useTripGenerationState();
  const travelersNumber = tripSelectors.travelersNumber();

  const handleCardPress = (value: number) => {
    tripActions.setTravelersNumber(value);
  };

  return {
    handleCardPress,
    travelersNumber,
    data: TRAVELERS_NUMBER_OPTIONS,
  };
};
