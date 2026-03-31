import { navigationService } from '@/features/core/navigation';
import { useDeleteAccount } from '@/features/profile/facades/useDeleteAccount';
import { useLogout } from '@/features/profile/facades/useLogout';
import { useProfileData } from '@/features/profile/facades/useProfileData';
import { components } from '@/ui/style/dimensions/components';
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
    navigationService.toShowAllTrips();
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
