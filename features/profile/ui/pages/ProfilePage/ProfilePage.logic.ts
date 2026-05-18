import { navigationService } from '@/features/core/navigation';
import { components } from '@/features/core/ui';
import { useProfileData } from '@/features/profile/facades/useProfileData';
import { useUserProfileModal } from '@clerk/expo';
import { thumbs } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';

export const useProfilePageLogic = () => {
  const { userId, username, email, totalTrips, favoriteTrips, userTokens, isTripsLoading } = useProfileData();
  const { presentUserProfile } = useUserProfileModal();

  const isUserLoading = !userId;

  const avatar = createAvatar(thumbs, {
    radius: components.profileImageHeight / 2,
    seed: userId,
  }).toString();

  const goToChangeLanguage = () => {
    navigationService.toChangeLanguage();
  };

  const goToShowAllTrips = () => {
    navigationService.toTripList();
  };

  return {
    avatar,
    isUserLoading,
    username,
    email,
    totalTrips,
    favoriteTrips,
    isTripDataLoading: isTripsLoading,
    userTokens,
    goToChangeLanguage,
    goToShowAllTrips,
    presentUserProfile,
  };
};
