import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';

export const useGetFavoriteTrips = () => {
  const { getTrips } = useTripRepository();
  const trips = getTrips();

  return { favoriteTrips: trips?.filter(t => t.isFavorite) ?? [] };
};
