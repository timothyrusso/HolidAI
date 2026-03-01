import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';

export const useGetUserTrips = () => {
  const { user } = useUser();
  const userId = user?.id;

  const userTrips = useQuery(api.trips.getAllTripsbyUserId, { userId: userId ?? '' });

  const isLoading = userTrips === undefined;

  const getUserTrips = () => {
    if (!user) return;

    return userTrips;
  };

  const getTotalTrips = () => {
    return userTrips?.length ?? 0;
  };

  const getFavouriteTrips = () => {
    return userTrips?.filter(trip => trip.isFavorite) ?? [];
  };

  const getLastCreatedTrip = () => {
    return userTrips?.sort((a, b) => {
      const dateA = new Date(a.tripAiResp.tripDetails.startDate);
      const dateB = new Date(b.tripAiResp.tripDetails.startDate);

      return dateA.getTime() - dateB.getTime();
    })[0];
  };

  const getActivityById = (tripId: string, activityId: number) => {
    return userTrips
      ?.find(trip => trip._id === tripId)
      ?.tripAiResp.dayPlans.find(dayPlan => dayPlan.schedule.find(activity => activity.placeNumberID === activityId))
      ?.schedule.find(activity => activity.placeNumberID === activityId);
  };

  const getTripById = (tripId: string) => {
    return userTrips?.find(trip => trip._id === tripId);
  };

  return {
    getUserTrips,
    getTotalTrips,
    getFavouriteTrips,
    getLastCreatedTrip,
    getActivityById,
    getTripById,
    isLoading,
  };
};
