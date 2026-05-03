import { navigationService } from '@/features/core/navigation';
import { useTripGenerationState } from '@/features/trip-generation/state/useTripGenerationState';
import { TravelerData } from '@/features/trip-generation/ui/pages/SelectTravelersPage/SelectTravelersPage.data';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useSelectTravelersPageLogic = () => {
  const { tripActions } = useTripGenerationState();
  const { t } = useTranslation();

  const [selectedTravelers, setSelectedTravelers] = useState<number>(0);

  const handleCardPress = (id: number) => {
    setSelectedTravelers(id);
    tripActions.setTravelerType(t(TravelerData[id].title));
  };

  const handleButtonPress = () => {
    tripActions.setTravelerType(t(TravelerData[selectedTravelers].title));
    navigationService.toSelectDates();
  };

  return {
    TravelerData,
    handleCardPress,
    selectedTravelers,
    handleButtonPress,
  };
};
