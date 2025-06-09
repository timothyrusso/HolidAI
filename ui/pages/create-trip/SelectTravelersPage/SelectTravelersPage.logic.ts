import { Routes, Stacks } from '@/ui/constants/navigation/routes';
import { useTripState } from '@/ui/state/trip';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TravelerData } from './SelectTravelersPage.data';

export const useSelectTravelersPageLogic = () => {
  const router = useRouter();
  const { tripActions } = useTripState();
  const { t } = useTranslation();

  const [selectedTravelers, setSelectedTravelers] = useState<number>(0);

  const handleCardPress = (id: number) => {
    setSelectedTravelers(id);
    tripActions.setTravelerType(t(TravelerData[id].title));
  };

  const handleButtonPress = () => router.push(`/${Stacks.CreateTrip}/${Routes.SelectDates}`);

  return {
    TravelerData,
    setSelectedTravelers,
    handleCardPress,
    selectedTravelers,
    handleButtonPress,
  };
};
