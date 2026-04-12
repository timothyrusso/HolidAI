import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';

export const useDeleteTrip = () => {
  const { deleteTrip } = useTripRepository();

  return { deleteTrip };
};
