import { navigationService } from '@/features/core/navigation';
import type { LocationInfo } from '@/features/trip-generation/domain/entities/LocationInfo';
import { useTripGenerationState } from '@/features/trip-generation/state/useTripGenerationState';
import { useState } from 'react';

const animation = require('@/features/core/ui/assets/lottie/search_animation.json');

export const useSearchPageLogic = () => {
  const { tripActions } = useTripGenerationState();
  const [locationInfo, setLocationInfo] = useState<LocationInfo>();

  const handleSearchPress = (locationInfo: LocationInfo) => {
    tripActions.setLocationInfo(locationInfo);
    setLocationInfo(locationInfo);
  };

  const handleParticipantsPress = () => navigationService.toSelectTravelers();

  const isButtonDisabled = !locationInfo;

  return {
    handleSearchPress,
    animation,
    handleParticipantsPress,
    isButtonDisabled,
  };
};
