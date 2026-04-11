import { navigationService } from '@/features/core/navigation';
import type { LocationInfo } from '@/features/trip-generation/domain/entities/LocationInfo';
import { useTripGenerationState } from '@/features/trip-generation/state/useTripGenerationState';
import { useState } from 'react';

export const useSearchPageLogic = () => {
  const { tripActions } = useTripGenerationState();
  const [locationInfo, setLocationInfo] = useState<LocationInfo>();

  const handleSearchPress = (locationInfo: LocationInfo) => {
    tripActions.setLocationInfo(locationInfo);
    setLocationInfo(locationInfo);
  };

  const handleParticipantsPress = () => navigationService.toSelectTravelers();

  const isButtonDisabled = !locationInfo;

  const animation = require('@/ui/assets/lottie/search_animation.json');

  return {
    handleSearchPress,
    animation,
    handleParticipantsPress,
    isButtonDisabled,
  };
};
