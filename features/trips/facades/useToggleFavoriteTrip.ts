import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';

export const useToggleFavoriteTrip = () => {
  const { toggleFavoriteTrip } = useTripRepository();

  return { toggleFavoriteTrip };
};
