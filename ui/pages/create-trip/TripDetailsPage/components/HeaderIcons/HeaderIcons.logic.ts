import { api } from '@/convex/_generated/api';
import { useAddToFavoriteTrip } from '@/ui/queries/trips/mutation/useAddToFavoriteTrip';
import { useRemoveTrip } from '@/ui/queries/trips/mutation/useRemoveTrip';
import { useGetUserTripsQuery } from '@/ui/queries/trips/query/useGetUserTripsQuery';
import { useUser } from '@clerk/clerk-expo';
import { useMutation, useQuery } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

export const useHeaderIconsLogic = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { data } = useGetUserTripsQuery();

  const { user } = useUser();
  const userId = user?.id;

  const convexTripsData = useQuery(api.trips.getAllTripsbyUserId, { userId: userId ?? '' });

  const tripToDelete = convexTripsData?.find(trip => trip.tripId === id);

  const trip = data?.selectTripById(id as string);

  const [isFavorite, setIsFavorite] = useState(trip?.isFavorite);

  const removeTripMutation = useMutation(api.trips.deleteTrip);

  const { removeTrip } = useRemoveTrip(trip?.docId ?? '');
  const { updateFavorite } = useAddToFavoriteTrip(trip?.docId ?? '');

  const addToFavoritesHandler = useCallback(() => {
    setIsFavorite(prev => !prev);
    updateFavorite(isFavorite ?? false);
  }, [isFavorite]);

  const handleDeleteTrip = () => {
    removeTrip(trip?.docId ?? '');
    if (tripToDelete) {
      removeTripMutation({ id: tripToDelete._id });
    }
    router.back();
  };

  const goBackHandler = () => router.back();

  return { goBackHandler, addToFavoritesHandler, handleDeleteTrip, isFavorite };
};
