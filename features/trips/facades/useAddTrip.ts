import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';

export const useAddTrip = () => {
  const { addTrip } = useTripRepository();

  return { addTrip };
};
