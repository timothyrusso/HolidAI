import { useAddToFavoriteTrip } from '@/ui/queries/trips/mutation/useAddToFavoriteTrip';
import { useRemoveTrip } from '@/ui/queries/trips/mutation/useRemoveTrip';
import { useGetUserTripsQuery } from '@/ui/queries/trips/query/useGetUserTripsQuery';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

export const useHeaderIconsLogic = () => {
  const { id } = useLocalSearchParams();

  const { data } = useGetUserTripsQuery();

  const trip = data?.selectTripById(id as string);

  const [isFavorite, setIsFavorite] = useState(trip?.isFavorite);

  const { removeTrip } = useRemoveTrip(trip?.docId ?? '');
  const { updateFavorite } = useAddToFavoriteTrip(trip?.docId ?? '');

  const addToFavoritesHandler = useCallback(() => {
    setIsFavorite(prev => !prev);
    updateFavorite(isFavorite ?? false);
  }, [isFavorite]);

  const handleDeleteTrip = () => {
    removeTrip(trip?.docId ?? '');
    router.back();
  };

  const router = useRouter();

  const goBackHandler = () => router.back();

  return { goBackHandler, addToFavoritesHandler, handleDeleteTrip, isFavorite };
};
