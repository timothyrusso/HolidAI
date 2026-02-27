import { api } from '@/convex/_generated/api';
import { logger } from '@/di/resolve';
import { Routes, Stacks } from '@/modules/navigation/domain/entities/routes';
import { useGetUserTrips } from '@/ui/queries/trips/query/useGetUserTrips';
import { useGetUserStatus } from '@/ui/queries/user/query/useGetUserStatus';
import { components } from '@/ui/style/dimensions/components';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { thumbs } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { useMutation } from 'convex/react';
import { router } from 'expo-router';
import { useState } from 'react';

export const useProfilePageLogic = () => {
  const { signOut } = useClerk();
  const { user } = useUser();

  const { isLoading, getTotalTrips, getFavouriteTrips } = useGetUserTrips();

  const totalTrips = getTotalTrips();
  const favoriteTrips = getFavouriteTrips();

  const [isLogoutLoading, setIsLogoutLoading] = useState<boolean>(false);
  const [isDeleteAccountLoading, setIsDeleteAccountLoading] = useState<boolean>(false);

  const deleteUserTrips = useMutation(api.trips.deleteAllTripsByUserId);

  const { getUserTokens } = useGetUserStatus();

  const userTokens = getUserTokens();

  const logout = async () => {
    setIsLogoutLoading(true);
    try {
      await signOut();
      router.replace(`/${Routes.Welcome}`);
    } catch (error) {
      logger.error(error as Error);
    } finally {
      setIsLogoutLoading(false);
    }
  };

  const deleteAccount = async () => {
    setIsDeleteAccountLoading(true);
    try {
      await user?.delete();

      await deleteUserTrips({ userId: user?.id ?? '' });

      router.replace(`/${Routes.Welcome}`);
    } catch (error) {
      logger.error(error as Error);
    } finally {
      setIsDeleteAccountLoading(false);
    }
  };

  const avatar = createAvatar(thumbs, {
    radius: components.profileImageHeight / 2,
    seed: user?.id,
  }).toString();

  const username = user?.fullName;
  const email = user?.emailAddresses[0].emailAddress;

  const goToChangeLanguage = () => {
    router.push(`/${Stacks.Profile}/${Routes.ChangeLanguage}`);
  };

  const goToShowAllTrips = () => {
    router.push(`/${Stacks.MyTrips}/${Routes.ShowAllTrips}`);
  };

  return {
    logout,
    deleteAccount,
    avatar,
    username,
    email,
    totalTrips,
    favoriteTrips,
    isTripDataLoading: isLoading,
    goToChangeLanguage,
    goToShowAllTrips,
    isLogoutLoading,
    isDeleteAccountLoading,
    userTokens,
  };
};
