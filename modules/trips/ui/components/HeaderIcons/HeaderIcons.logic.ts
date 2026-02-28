import { api } from '@/convex/_generated/api';
import { useGetUserTrips } from '@/ui/queries/trips/query/useGetUserTrips';
import { useMutation } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

export const useHeaderIconsLogic = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { getTripById } = useGetUserTrips();

  const trip = getTripById(id as string);

  const [isFavorite, setIsFavorite] = useState(trip?.isFavorite);
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);

  const removeTripMutation = useMutation(api.trips.deleteTrip);
  const toggleFavoriteTripMutation = useMutation(api.trips.toggleFavoriteTrip);

  const addToFavoritesHandler = useCallback(() => {
    if (!trip) return;
    setShouldAnimate(!isFavorite);
    setIsFavorite(prev => !prev);
    toggleFavoriteTripMutation({ id: trip._id, isFavorite: !isFavorite });
  }, [isFavorite]);

  const handleDeleteTrip = async () => {
    if (!trip) return;
    await removeTripMutation({ id: trip._id });
    router.back();
  };

  const goBackHandler = () => router.back();

  return { goBackHandler, addToFavoritesHandler, handleDeleteTrip, isFavorite, shouldAnimate };
};
