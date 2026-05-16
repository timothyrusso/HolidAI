import { navigationService } from '@/features/core/navigation';
import { components } from '@/features/core/ui';
import { useDeleteAccount } from '@/features/profile/facades/useDeleteAccount';
import { useProfileData } from '@/features/profile/facades/useProfileData';
import { useLogout } from '@/features/user';
import { thumbs } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';

export const useProfilePageLogic = () => {
  const { userId, username, email, totalTrips, favoriteTrips, userTokens, isTripsLoading } = useProfileData();
  const { logout, isLoading: isLogoutLoading } = useLogout();
  const { deleteAccount, isLoading: isDeleteAccountLoading } = useDeleteAccount();

  const isUserLoading = !userId;

  const avatar = createAvatar(thumbs, {
    radius: components.profileImageHeight / 2,
    seed: userId,
  }).toString();

  const handleLogout = async () => {
    const success = await logout();
    if (success) navigationService.toWelcome();
  };

  const handleDeleteAccount = async () => {
    const success = await deleteAccount();
    if (success) navigationService.toWelcome();
  };

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
    isLogoutLoading,
    isDeleteAccountLoading,
    handleLogout,
    handleDeleteAccount,
    goToChangeLanguage,
    goToShowAllTrips,
  };
};
