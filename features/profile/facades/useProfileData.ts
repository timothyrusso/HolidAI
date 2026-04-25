import { useProfileRepository } from '@/features/profile/data/repositories/useProfileRepository';
import { useGetFavoriteTrips } from '@/features/trips/facades/useGetFavoriteTrips';
import { useGetTrips } from '@/features/trips/facades/useGetTrips';
import { useGetUserStatus } from '@/ui/queries/user/query/useGetUserStatus';

export const useProfileData = () => {
  const repo = useProfileRepository();
  const { isLoading: isTripsLoading, totalTrips } = useGetTrips();
  const { favoriteTrips } = useGetFavoriteTrips();
  const { getUserTokens } = useGetUserStatus();

  const user = repo.getUser();

  return {
    userId: user?.id,
    username: user?.firstName,
    email: user?.email,
    totalTrips,
    favoriteTrips,
    userTokens: getUserTokens(),
    isTripsLoading,
  };
};
