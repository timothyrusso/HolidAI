import { useProfileRepository } from '@/features/profile/data/repositories/useProfileRepository';
import { useGetUserTrips } from '@/ui/queries/trips/query/useGetUserTrips';
import { useGetUserStatus } from '@/ui/queries/user/query/useGetUserStatus';

export const useProfileData = () => {
  const repo = useProfileRepository();
  const { isLoading: isTripsLoading, getTotalTrips, getFavouriteTrips } = useGetUserTrips();
  const { getUserTokens } = useGetUserStatus();

  return {
    userId: repo.getUser()?.id,
    username: repo.getUser()?.firstName,
    email: repo.getUser()?.email,
    totalTrips: getTotalTrips(),
    favoriteTrips: getFavouriteTrips(),
    userTokens: getUserTokens(),
    isTripsLoading,
  };
};
