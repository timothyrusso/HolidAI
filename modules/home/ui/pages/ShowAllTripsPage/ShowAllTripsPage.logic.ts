import { Routes } from '@/modules/navigation/domain/entities/routes';
import { useUniqueItems } from '@/modules/shared/hooks/useUniqueItems';
import { useGetUserTrips } from '@/ui/queries/trips/query/useGetUserTrips';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export const useShowAllTripsPageLogic = () => {
  const { getUniqueItems } = useUniqueItems();
  const { isLoading, getTotalTrips, getUserTrips } = useGetUserTrips();

  const totalTrips = getTotalTrips();
  const trips = getUserTrips();

  const skeletonCards = getUniqueItems(4);

  const userTrips = isLoading ? skeletonCards : trips;
  const router = useRouter();

  useEffect(() => {
    if (totalTrips === 0) {
      router.push(`/${Routes.HomePage}`);
    }
  }, []);

  return { userTrips };
};
