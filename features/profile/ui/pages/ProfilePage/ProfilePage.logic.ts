import { navigationService } from '@/features/core/navigation';
import { components } from '@/features/core/ui';
import { useProfileData } from '@/features/profile/facades/useProfileData';

export const useProfilePageLogic = () => {
  const { userId, username, profileImageUrl, totalTrips, favoriteTrips, userTokens, isTripsLoading } = useProfileData();

  const isUserLoading = !userId;

  const goToChangeLanguage = () => {
    navigationService.toChangeLanguage();
  };

  const goToAccountSettings = () => {
    navigationService.toAccountSettings();
  };

  const goToShowAllTrips = () => {
    navigationService.toTripList();
  };

  const profileImage = `${profileImageUrl}?height=${components.profileImageHeight}&width=${components.profileImageHeight}&quality=100&fit=crop`;

  return {
    isUserLoading,
    username,
    profileImage,
    totalTrips,
    favoriteTrips,
    isTripDataLoading: isTripsLoading,
    userTokens,
    goToChangeLanguage,
    goToShowAllTrips,
    goToAccountSettings,
  };
};
