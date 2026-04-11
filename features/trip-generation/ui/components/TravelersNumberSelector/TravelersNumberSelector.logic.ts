import { useTripGenerationState } from '@/features/trip-generation/state/useTripGenerationState';
import { useState } from 'react';

const TRAVELERS_NUMBER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const useTravelersNumberSelectorLogic = () => {
  const { tripActions } = useTripGenerationState();

  const [travelersNumber, setTravelersNumber] = useState<number>(1);

  const handleCardPress = (value: number) => {
    setTravelersNumber(value);
    tripActions.setTravelersNumber(value);
  };

  return {
    handleCardPress,
    travelersNumber,
    data: TRAVELERS_NUMBER_OPTIONS,
  };
};
