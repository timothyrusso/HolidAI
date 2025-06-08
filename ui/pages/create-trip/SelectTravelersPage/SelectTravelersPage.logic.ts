import { Routes, Stacks } from '@/ui/constants/navigation/routes';
import { useTripState } from '@/ui/state/trip';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { TravelerData } from './SelectTravelersPage.data';

export const useSelectTravelersPageLogic = () => {
  const router = useRouter();
  const { tripActions } = useTripState();

  const [selectedTravelers, setSelectedTravelers] = useState<number>(0);

  const handleCardPress = (id: number) => {
    setSelectedTravelers(id);
    tripActions.setTravelerInfo(TravelerData[id].people);
  };

  const handleButtonPress = () => router.push(`/${Stacks.CreateTrip}/${Routes.SelectDates}`);

  return {
    TravelerData,

    handleCardPress,
    selectedTravelers,
    handleButtonPress,
  };
};
