import { getTodayInLocalTimezone } from '@/features/core/dates';
import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';

export const useGetUpcomingTrip = () => {
  const { getTrips } = useTripRepository();
  const trips = getTrips();
  const isLoading = trips === undefined;

  const upcomingTrip = (() => {
    const todayStr = getTodayInLocalTimezone().toISOString().split('T')[0];
    return trips
      ?.filter(trip => trip.tripAiResp.tripDetails.startDate >= todayStr)
      .sort((a, b) => a.tripAiResp.tripDetails.startDate.localeCompare(b.tripAiResp.tripDetails.startDate))[0];
  })();

  return { upcomingTrip, isLoading };
};
