import { logger } from '@/di/resolve';
import { Routes, Stacks } from '@/ui/constants/navigation/routes';
import { components } from '@/ui/constants/style/dimensions/components';
import { useGetUserTripsQuery } from '@/ui/queries/trips/query/useGetUserTripsQuery';
import { miniavs } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import auth from '@react-native-firebase/auth';
import { router } from 'expo-router';

export const useProfilePageLogic = () => {
  const { data, isLoading } = useGetUserTripsQuery();

  const logout = () => {
    auth()
      .signOut()
      .then(() => {
        router.replace(`/${Routes.Welcome}`);
      })
      .catch(error => {
        logger.error(error);
      });
  };

  const deleteAccount = () => {
    auth()
      .currentUser?.delete()
      .then(() => {
        router.replace(`/${Routes.Welcome}`);
      })
      .catch(error => {
        logger.error(error);
      });
  };

  const avatar = createAvatar(miniavs, {
    radius: components.profileImageHeight / 2,
    seed: auth().currentUser?.uid,
  }).toString();

  const username = auth().currentUser?.displayName;
  const email = auth().currentUser?.email;

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
