import { useGetUpcomingTrip } from '@/features/trips/facades/useGetUpcomingTrip';

export const useMainPlacesListLogic = () => {
  const { upcomingTrip, isLoading } = useGetUpcomingTrip();

  const places = upcomingTrip?.tripAiResp.dayPlans[0]?.schedule;

  const listItems = places
    ? [
        ...places.slice(0, 3).map(place => ({ id: place.placeName, photoResourceName: place.photoResourceNames?.[0] })),
        { id: 'last-item', photoResourceName: undefined },
      ]
    : [];

  return { listItems, isLoading };
};
