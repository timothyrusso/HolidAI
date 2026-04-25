import { navigationService } from '@/features/core/navigation';
import { useTripGenerationState } from '@/features/trip-generation/state/useTripGenerationState';
import { useTranslation } from 'react-i18next';
import { TravelerData } from './SelectTravelersPage.data';

export const useSelectTravelersPageLogic = () => {
  const { tripActions, tripSelectors } = useTripGenerationState();
  const { t } = useTranslation();

  const travelerType = tripSelectors.travelerType();
  const selectedTravelers = Math.max(
    0,
    TravelerData.findIndex(item => t(item.title) === travelerType),
  );

  const handleCardPress = (id: number) => {
    tripActions.setTravelerType(t(TravelerData[id].title));
  };

  const handleButtonPress = () => navigationService.toSelectDates();

  return {
    TravelerData,
    handleCardPress,
    selectedTravelers,
    handleButtonPress,
  };
};
