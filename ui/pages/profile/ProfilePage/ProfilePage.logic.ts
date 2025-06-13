import { db } from '@/configs/firebaseConfig';
import { logger } from '@/di/resolve';
import { dbKeys } from '@/modules/trip/domain/entities/DbKeys';
import { Routes, Stacks } from '@/ui/constants/navigation/routes';
import { components } from '@/ui/constants/style/dimensions/components';
import { useGetUserTripsQuery } from '@/ui/queries/trips/query/useGetUserTripsQuery';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { miniavs } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { router } from 'expo-router';
import { deleteDoc, doc } from 'firebase/firestore';

export const useProfilePageLogic = () => {
  const { data, isLoading } = useGetUserTripsQuery();
  const { signOut } = useClerk();
  const { user } = useUser();

  const logout = async () => {
    try {
      await signOut();
      router.replace(`/${Routes.Welcome}`);
    } catch (error) {
      logger.error(error as Error);
    }
  };

  const deleteAccount = async () => {
    try {
      // Delete user data from firestore
      await deleteDoc(doc(db, `${dbKeys.userTrips}/${user?.id}`));

      await user?.delete();

      router.replace(`/${Routes.Welcome}`);
    } catch (error) {
      logger.error(error as Error);
    }
  };

  const avatar = createAvatar(miniavs, {
    radius: components.profileImageHeight / 2,
    seed: user?.id,
  }).toString();

  const username = user?.fullName;
  const email = user?.emailAddresses[0].emailAddress;

  const totalTrips = data?.totalTrips ?? 0;
  const favoriteTrips = data?.favoriteTrips ?? [];

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
  };
};
