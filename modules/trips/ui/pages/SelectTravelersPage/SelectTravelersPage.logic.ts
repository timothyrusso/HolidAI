import { navigationService } from '@/features/core/navigation';
import { useTripState } from '@/ui/state/trip';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TravelerData } from './SelectTravelersPage.data';

export const useSelectTravelersPageLogic = () => {
  const { tripActions } = useTripState();
  const { t } = useTranslation();

  const [selectedTravelers, setSelectedTravelers] = useState<number>(0);

  useEffect(() => {
    tripActions.setTravelerType(t(TravelerData[0].title));
  }, []);

  const handleCardPress = (id: number) => {
    setSelectedTravelers(id);
    tripActions.setTravelerType(t(TravelerData[id].title));
  };

  const handleButtonPress = () => navigationService.toSelectDates();

  return {
    TravelerData,
    setSelectedTravelers,
    handleCardPress,
    selectedTravelers,
    handleButtonPress,
  };
};
