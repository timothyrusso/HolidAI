import { useDeleteAccount } from '@/features/profile/facades/useDeleteAccount';
import { useLogout } from '@/features/profile/facades/useLogout';
import { useProfileData } from '@/features/profile/facades/useProfileData';
import { Routes, Stacks } from '@/modules/navigation/domain/entities/routes';
import { components } from '@/ui/style/dimensions/components';
import { thumbs } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { router } from 'expo-router';

export const useProfilePageLogic = () => {
  const { userId, username, email, totalTrips, favoriteTrips, userTokens, isTripsLoading } = useProfileData();
  const { logout, isLoading: isLogoutLoading } = useLogout();
  const { deleteAccount, isLoading: isDeleteAccountLoading } = useDeleteAccount();

  const avatar = createAvatar(thumbs, {
    radius: components.profileImageHeight / 2,
    seed: userId,
  }).toString();

  const handleLogout = async () => {
    const success = await logout();
    if (success) router.replace(`/${Routes.Welcome}`);
  };

  const handleDeleteAccount = async () => {
    const success = await deleteAccount();
    if (success) router.replace(`/${Routes.Welcome}`);
  };

  const goToChangeLanguage = () => {
    router.push(`/${Stacks.Profile}/${Routes.ChangeLanguage}`);
  };

  const goToShowAllTrips = () => {
    router.push(`/${Stacks.HomePage}/${Routes.ShowAllTrips}`);
  };

  return {
    avatar,
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
