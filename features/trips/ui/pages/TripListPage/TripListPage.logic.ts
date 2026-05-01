import { navigationService } from '@/features/core/navigation';
import type { Trip } from '@/features/trips/domain/entities/Trip';
import { useGetTrips } from '@/features/trips/facades/useGetTrips';
import type { UniqueItem } from '@/features/trips/hooks/useUniqueItems';
import { useUniqueItems } from '@/features/trips/hooks/useUniqueItems';
import { useEffect } from 'react';

export type { Trip, UniqueItem };

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
