import { db } from '@/configs/firebaseConfig';
import type { UserTrips } from '@/modules/trip/domain/dto/UserTripsDTO';
import { dbKeys } from '@/modules/trip/domain/entities/DbKeys';
import { useUser } from '@clerk/clerk-expo';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDoc, doc } from 'firebase/firestore';
import { tripsKeys } from '../TripsKeys';

export const useRemoveTrip = (id: string) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { mutate } = useMutation({
    mutationKey: [tripsKeys.removeUserTrip, id],
    mutationFn: async (id: string) => {
      const docRef = doc(db, `${dbKeys.userTrips}/${user?.id}/trips`, id);
      await deleteDoc(docRef);

      return true;
    },
    onMutate: () => {
      queryClient.setQueryData([tripsKeys.getUserTrips], (oldTrips: UserTrips[]) => {
        return oldTrips?.filter(trip => trip.docId !== id);
      });
    },
    onError: () => {
      queryClient.setQueryData([tripsKeys.getUserTrips], (oldTrips: UserTrips[]) => {
        return oldTrips;
      });
    },
  });

  return {
    removeTrip: mutate,
  };
};
