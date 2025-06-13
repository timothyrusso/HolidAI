import { db } from '@/configs/firebaseConfig';
import type { UserTrips } from '@/modules/trip/domain/dto/UserTripsDTO';
import { dbKeys } from '@/modules/trip/domain/entities/DbKeys';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query } from 'firebase/firestore';
import { QueryOptionKeys } from '../../QueryOptionKeys';
import { tripsKeys } from '../TripsKeys';

export const useGetUserTripsQuery = () => {
  const { user } = useUser();

  const getMyTrips = async () => {
    if (!user) return;

    const userTrips: UserTrips[] = [];

    const q = query(collection(db, `${dbKeys.userTrips}/${user?.id}/trips`));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(doc => {
      userTrips.push(doc.data() as UserTrips);
    });

    return userTrips;
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: [tripsKeys.getUserTrips],
    queryFn: getMyTrips,
    enabled: !!user,
    staleTime: QueryOptionKeys.STALE_TIME,
    gcTime: QueryOptionKeys.GC_TIME,
    select: data => ({
      trips: data,
      totalTrips: data?.length,
      favoriteTrips: data?.filter(trip => trip.isFavorite),
      lastCreatedTrip: data?.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        return dateB.getTime() - dateA.getTime();
      })[0],
      selectActivityById: (tripId: string, activityId: number) => {
        return data
          ?.find(trip => trip.docId === tripId)
          ?.tripAiResp.dayPlans.find(dayPlan =>
            dayPlan.schedule.find(activity => activity.placeNumberID === activityId),
          )
          ?.schedule.find(activity => activity.placeNumberID === activityId);
      },
      selectTripById: (tripId: string) => {
        return data?.find(trip => trip.docId === tripId);
      },
    }),
  });

  return { data, isLoading, refetch };
};
