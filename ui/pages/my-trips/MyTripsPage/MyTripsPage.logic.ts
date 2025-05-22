import { useGetUserTripsQuery } from '@/ui/queries/trips/query/useGetUserTripsQuery';
import { UrlTypes, useUnsplashImages } from '@/ui/queries/unsplashImages/query/useUnsplashImages';

export const useMyTripsPageLogic = () => {
  const { data, isLoading } = useGetUserTripsQuery();

  const lastCreatedTrip = data?.lastCreatedTrip;

  const location = data?.lastCreatedTrip?.tripAiResp.tripDetails.location?.split(',')[0] ?? '';

  const { data: imageUrl } = useUnsplashImages(location, UrlTypes.REGULAR);

  const image = imageUrl;
  const days = lastCreatedTrip?.tripAiResp.tripDetails.durationDays ?? 0;
  const budget = lastCreatedTrip?.tripAiResp.tripDetails.budget ?? 'MY_TRIP.BUDGET_NOT_AVAILABLE';
  const travelers = lastCreatedTrip?.tripAiResp.tripDetails.travelers ?? 0;

  return {
    lastCreatedTrip: data?.lastCreatedTrip,
    isLoading,
    image,
    location,
    days,
    budget,
    travelers,
    tripId: lastCreatedTrip?.docId ?? '',
    tripStartDate: lastCreatedTrip?.tripAiResp.tripDetails.startDate ?? '',
  };
};
