import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';

export const useGetTrips = () => {
  const { getTrips } = useTripRepository();
  const trips = getTrips();

  return {
    trips,
    isLoading: trips === undefined,
    totalTrips: trips?.length ?? 0,
  };
};
