import { navigationService } from '@/features/core/navigation';
import type { LocationInfo } from '@/modules/trips/domain/entities/LocationInfo';
import { useTripState } from '@/ui/state/trip';
import { useState } from 'react';

export const useSearchPageLogic = () => {
  const { tripActions } = useTripState();
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
