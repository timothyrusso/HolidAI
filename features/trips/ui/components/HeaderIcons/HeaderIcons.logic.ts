import { api } from '@/convex/_generated/api';
import { navigationService } from '@/features/core/navigation';
import { useGetTripById } from '@/features/trips/facades/useGetTripById';
import { useMutation } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';

export const useHeaderIconsLogic = () => {
  const { id, fromGenerate } = useLocalSearchParams();

  const { trip } = useGetTripById(id as string);

  const [isFavorite, setIsFavorite] = useState<boolean>(trip?.isFavorite ?? false);
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
