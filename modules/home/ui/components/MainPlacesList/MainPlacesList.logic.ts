import { useGetUserTrips } from '@/ui/queries/trips/query/useGetUserTrips';

export const useMainPlacesListLogic = () => {
  const { getUpcomingTrip, isLoading } = useGetUserTrips();

  const places = getUpcomingTrip()?.tripAiResp.dayPlans[0]?.schedule;

  const listItems = places ? [...places.map(place => ({ id: place.placeName })).slice(0, 3), { id: 'last-item' }] : [];

  return { listItems, isLoading };
};
