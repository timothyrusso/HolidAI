import { useGetFavoriteTrips, useGetTrips } from '@/features/trips';
import { useGetUser, useGetUserTokens } from '@/features/user';

export const useProfileData = () => {
  const { user } = useGetUser();
  const { isLoading: isTripsLoading, totalTrips } = useGetTrips();
  const { favoriteTrips } = useGetFavoriteTrips();
  const { userTokens } = useGetUserTokens();

  return {
    userId: user?.id,
    username: user?.firstName,
    email: user?.email,
    totalTrips,
    favoriteTrips,
    userTokens,
    isTripsLoading,
  };
};
