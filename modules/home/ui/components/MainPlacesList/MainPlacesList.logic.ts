import { useGetUserTrips } from '@/ui/queries/trips/query/useGetUserTrips';
import { useIsFetching } from '@tanstack/react-query';

export const useMainPlacesListLogic = () => {
  const { getUpcomingTrip } = useGetUserTrips();

  const places = getUpcomingTrip()?.tripAiResp.dayPlans[0]?.schedule;

  const listItems = places ? [...places.map(place => ({ id: place.placeName })).slice(0, 3), { id: 'last-item' }] : [];

  const isFetching = useIsFetching();

  return { listItems, isFetching };
};
