import { navigationService } from '@/features/core/navigation';
import { useUniqueItems } from '@/modules/shared/hooks/useUniqueItems';
import { useGetUserTrips } from '@/ui/queries/trips/query/useGetUserTrips';

import { useEffect } from 'react';

export const useShowAllTripsPageLogic = () => {
  const { getUniqueItems } = useUniqueItems();
  const { isLoading, getTotalTrips, getUserTrips } = useGetUserTrips();

  const totalTrips = getTotalTrips();
  const trips = getUserTrips();

  const skeletonCards = getUniqueItems(4);

  const userTrips = isLoading ? skeletonCards : trips;

  useEffect(() => {
    if (!isLoading && totalTrips === 0) {
      navigationService.toHome();
    }
  }, [isLoading, totalTrips]);

  return { userTrips };
};
