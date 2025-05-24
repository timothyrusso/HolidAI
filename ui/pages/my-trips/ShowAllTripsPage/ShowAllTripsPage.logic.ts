import { Routes } from '@/ui/constants/routes';
import { useUniqueItems } from '@/ui/hooks/useUniqueItems';
import { useGetUserTripsQuery } from '@/ui/queries/trips/query/useGetUserTripsQuery';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export const useShowAllTripsPageLogic = () => {
  const { data, isLoading } = useGetUserTripsQuery();
  const { getUniqueItems } = useUniqueItems();

  const skeletonCards = getUniqueItems(4);

  const userTrips = isLoading ? skeletonCards : data?.trips;
  const router = useRouter();

  useEffect(() => {
    if (data?.totalTrips === 0) {
      router.push(`/${Routes.MyTrips}`);
    }
  }, []);

  return { userTrips };
};
