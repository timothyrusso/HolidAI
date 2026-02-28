import { Routes, Stacks } from '@/modules/navigation/domain/entities/routes';
import type { LocationInfo } from '@/modules/trips/domain/entities/LocationInfo';
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

  const animation = require('@/ui/assets/lottie/search_animation.json');

  return {
    handleSearchPress,
    animation,
    handleParticipantsPress,
    isButtonDisabled,
  };
};
