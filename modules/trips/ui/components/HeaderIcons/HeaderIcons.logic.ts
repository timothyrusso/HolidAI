import { api } from '@/convex/_generated/api';
import { navigationService } from '@/features/core/navigation';
import { useGetUserTrips } from '@/ui/queries/trips/query/useGetUserTrips';
import { useMutation } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';

export const useHeaderIconsLogic = () => {
  const { id, fromGenerate } = useLocalSearchParams();

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
    navigationService.back();
  };

  const goBackHandler = () => {
    if (fromGenerate === 'true') {
      navigationService.toHome();
    } else {
      navigationService.back();
    }
  };

  return { goBackHandler, addToFavoritesHandler, handleDeleteTrip, isFavorite, shouldAnimate };
};
