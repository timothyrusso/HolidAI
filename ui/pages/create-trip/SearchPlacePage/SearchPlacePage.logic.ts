import type { LocationInfo } from '@/modules/trip/domain/entities/LocationInfo';
import { Routes, Stacks } from '@/ui/constants/navigation/routes';
import { useTripState } from '@/ui/state/trip';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export const useSearchPageLogic = () => {
  const router = useRouter();
  const { tripActions } = useTripState();
  const [locationInfo, setLocationInfo] = useState<LocationInfo>();

  const handleSearchPress = (locationInfo: LocationInfo) => {
    tripActions.setLocationInfo(locationInfo);
    setLocationInfo(locationInfo);
  };

  const handleParticipantsPress = () => router.push(`/${Stacks.CreateTrip}/${Routes.SelectTraveler}`);

  const isButtonDisabled = !locationInfo;

  const animation = require('../../../assets/lottie/search_animation.json');

  return {
    handleSearchPress,
    animation,
    handleParticipantsPress,
    isButtonDisabled,
  };
};
