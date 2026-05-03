import { navigationService } from '@/features/core/navigation';
import { useGetTrips } from '@/features/trips/facades/useGetTrips';
import { useUniqueItems } from '@/features/trips/hooks/useUniqueItems';
import { useEffect } from 'react';

export type { Trip } from '@/features/trips/domain/entities/Trip';
export type { UniqueItem } from '@/features/trips/hooks/useUniqueItems';

export const useTripListPageLogic = () => {
  const { getUniqueItems } = useUniqueItems();
  const { isLoading, totalTrips, trips } = useGetTrips();

  const skeletonCards = getUniqueItems(4);

  const userTrips = isLoading ? skeletonCards : trips;

  useEffect(() => {
    if (!isLoading && totalTrips === 0) {
      navigationService.toHome();
    }
  }, [isLoading, totalTrips]);

  return { userTrips };
};
