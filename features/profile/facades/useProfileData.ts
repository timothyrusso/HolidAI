import { useProfileRepository } from '@/features/profile/data/repositories/useProfileRepository';
import { useGetUserTrips } from '@/ui/queries/trips/query/useGetUserTrips';
import { useGetUserStatus } from '@/ui/queries/user/query/useGetUserStatus';

export const useProfileData = () => {
  const repo = useProfileRepository();
  const { isLoading: isTripsLoading, getTotalTrips, getFavouriteTrips } = useGetUserTrips();
  const { getUserTokens } = useGetUserStatus();

  const user = repo.getUser();

  return {
    userId: user?.id,
    username: user?.firstName,
    email: user?.email,
    totalTrips: getTotalTrips(),
    favoriteTrips: getFavouriteTrips(),
    userTokens: getUserTokens(),
    isTripsLoading,
  };
};
