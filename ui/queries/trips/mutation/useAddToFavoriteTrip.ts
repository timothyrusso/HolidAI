import { db } from '@/configs/firebaseConfig';
import { logger } from '@/di/resolve';
import type { UserTrips } from '@/modules/trip/domain/dto/UserTripsDTO';
import { dbKeys } from '@/modules/trip/domain/entities/DbKeys';
import auth from '@react-native-firebase/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';
import { tripsKeys } from '../TripsKeys';

export const useAddToFavoriteTrip = (id: string) => {
  const queryClient = useQueryClient();
  const user = auth().currentUser;

  const { mutate } = useMutation({
    mutationKey: [tripsKeys.addTripToFavorites, id],
    mutationFn: async (isFavorite: boolean) => {
      try {
        const docRef = doc(db, `${dbKeys.userTrips}/${user?.uid}/trips`, id);

        await updateDoc(docRef, {
          isFavorite: !isFavorite,
        });

        return true;
      } catch (error) {
        logger.error(new Error(`Error updating favorite trip: ${error}`), error);
        return false;
      }
    },
    onMutate: isFavorite => {
      queryClient.setQueryData([tripsKeys.getUserTrips], (oldTrips: UserTrips[]) => {
        return oldTrips?.map(trip => (trip.docId === id ? { ...trip, isFavorite: !isFavorite } : trip));
      });
    },
    onError: (_, isFavorite) => {
      queryClient.setQueryData([tripsKeys.getUserTrips], (oldTrips: UserTrips[]) => {
        return oldTrips?.map(trip => (trip.docId === id ? { ...trip, isFavorite } : trip));
      });
    },
  });

  return {
    updateFavorite: mutate,
  };
};
