import { useGetUserTrips } from '@/ui/queries/trips/query/useGetUserTrips';
import { UrlTypes, useUnsplashImages } from '@/ui/queries/unsplashImages/query/useUnsplashImages';

export const useMyTripsPageLogic = () => {
  const { isLoading, getLastCreatedTrip, getTotalTrips } = useGetUserTrips();

  const lastCreatedTrip = getLastCreatedTrip();

  const location = lastCreatedTrip?.tripAiResp.tripDetails.location?.split(',')[0] ?? '';

  const { data: imageUrl } = useUnsplashImages(location, UrlTypes.FULL);

  const image = imageUrl;

  const totalTrips = getTotalTrips();

  return {
    lastCreatedTrip,
    isLoading,
    image,
    location,
    tripId: lastCreatedTrip?._id ?? '',
    tripStartDate: lastCreatedTrip?.tripAiResp.tripDetails.startDate ?? '',
    totalTrips,
  };
};
