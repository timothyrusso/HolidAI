import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';

export const useGetTripById = (tripId: string) => {
  const { getTrips } = useTripRepository();
  const trip = getTrips()?.find(t => t._id === tripId);

  return { trip };
};
