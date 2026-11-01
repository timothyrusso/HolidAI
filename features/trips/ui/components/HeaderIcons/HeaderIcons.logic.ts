import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { navigationService } from '@/features/core/navigation';
import { useDeleteTrip } from '@/features/trips/facades/useDeleteTrip';
import { useGetTripById } from '@/features/trips/facades/useGetTripById';
import { useToggleFavoriteTrip } from '@/features/trips/facades/useToggleFavoriteTrip';

export const useHeaderIconsLogic = () => {
  const { id, fromGenerate } = useLocalSearchParams<{ id: string; fromGenerate?: string }>();

  const { trip } = useGetTripById(id);
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);

  const { toggleFavoriteTrip } = useToggleFavoriteTrip();
  const { deleteTrip } = useDeleteTrip();

  const addToFavoritesHandler = useCallback(() => {
    if (!trip) return;
    setShouldAnimate(!trip.isFavorite);
    toggleFavoriteTrip({ id: trip._id, isFavorite: !trip.isFavorite });
  }, [trip, toggleFavoriteTrip]);

  const handleDeleteTrip = () => {
    if (!trip) return;
    deleteTrip(trip._id, { onSuccess: () => navigationService.back() });
  };

  const goBackHandler = () => {
    if (fromGenerate === 'true') {
      navigationService.toHome();
    } else {
      navigationService.back();
    }
  };

  return {
    state: {
      isFavorite: trip?.isFavorite ?? false,
      shouldAnimate,
    },
    effects: {
      goBackHandler,
      addToFavoritesHandler,
      handleDeleteTrip,
    },
  };
};
