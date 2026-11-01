import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';

/** `addTrip` saves a trip as an Effect, for another feature's use case to run. */
export const useAddTrip = () => {
  const { addTrip } = useTripRepository();

  return { addTrip };
};
