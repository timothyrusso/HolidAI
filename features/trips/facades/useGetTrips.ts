import { useToast } from '@/features/core/toast';
import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';

export const useGetTrips = () => {
  const { getTrips, refetchTrips } = useTripRepository();
  const { showErrorToast } = useToast();
  const trips = getTrips();

  const refetch = async (): Promise<void> => {
    const result = await refetchTrips();
    if (!result.success) {
      showErrorToast(result.error);
    }
  };

  return {
    trips,
    isLoading: trips === undefined,
    totalTrips: trips?.length ?? 0,
    refetch,
  };
};
