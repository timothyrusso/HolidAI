import { useTripState } from '@/ui/state/trip';
import { useState } from 'react';

export const useTravelersNumberSliderLogic = () => {
  const { tripActions } = useTripState();
  const [travelersNumber, setTravelersNumber] = useState<number>(1);

  const handleSliderChange = (value: number) => {
    setTravelersNumber(value);
    tripActions.setTravelersNumber(value);
  };

  const MIN_SLIDER_VALUE = 1;
  const MAX_SLIDER_VALUE = 10;

  return { travelersNumber, handleSliderChange, MIN_SLIDER_VALUE, MAX_SLIDER_VALUE };
};
