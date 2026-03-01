import { api } from '@/convex/_generated/api';
import { getTodayInLocalTimezoneUseCase } from '@/modules/dates/application/getTodayInLocalTimezoneUseCase';
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

  const getUpcomingTrip = () => {
    const todayStr = getTodayInLocalTimezoneUseCase.toISOString().split('T')[0];

    return userTrips
      ?.filter(trip => trip.tripAiResp.tripDetails.startDate >= todayStr)
      .sort((a, b) => a.tripAiResp.tripDetails.startDate.localeCompare(b.tripAiResp.tripDetails.startDate))[0];
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
    getUpcomingTrip,
    getActivityById,
    getTripById,
    isLoading,
  };
};
