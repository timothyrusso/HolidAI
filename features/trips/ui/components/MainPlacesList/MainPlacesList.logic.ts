import { useGetUpcomingTrip } from '@/features/trips/facades/useGetUpcomingTrip';

export const useMainPlacesListLogic = () => {
  const { upcomingTrip, isLoading } = useGetUpcomingTrip();

  const places = upcomingTrip?.tripAiResp.dayPlans[0]?.schedule;

  const listItems = places ? [...places.map(place => ({ id: place.placeName })).slice(0, 3), { id: 'last-item' }] : [];

  return { listItems, isLoading };
};
