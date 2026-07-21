import { useEffect, useState } from 'react';
import { navigationService } from '@/features/core/navigation';
import { useGetTrips } from '@/features/trips/facades/useGetTrips';
import { useUniqueItems } from '@/features/trips/hooks/useUniqueItems';

export const useTripListPageLogic = () => {
  const { getUniqueItems } = useUniqueItems();
  const { isLoading, totalTrips, trips, refetch } = useGetTrips();
  const [refreshing, setRefreshing] = useState(false);

  const skeletonCards = getUniqueItems(4);

  const userTrips = isLoading ? skeletonCards : trips;

  const onRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    if (!isLoading && totalTrips === 0) {
      navigationService.toHome();
    }
  }, [isLoading, totalTrips]);

  return { userTrips, refreshing, onRefresh };
};
