import { useGetUserTrips } from '@/ui/queries/trips/query/useGetUserTrips';
import { UrlTypes, useUnsplashImages } from '@/ui/queries/unsplashImages/query/useUnsplashImages';

export const useHomePageLogic = () => {
  const { isLoading, getUpcomingTrip, getTotalTrips } = useGetUserTrips();

  const lastCreatedTrip = getUpcomingTrip();

  const location = lastCreatedTrip?.tripAiResp.tripDetails.location?.split(',')[0] ?? '';

  const { data: unsplashImage } = useUnsplashImages(location, UrlTypes.FULL);

  const totalTrips = getTotalTrips();

  return {
    lastCreatedTrip,
    isLoading,
    image: unsplashImage?.url,
    imageBlurHash: unsplashImage?.blurHash,
    location,
    tripId: lastCreatedTrip?._id ?? '',
    tripStartDate: lastCreatedTrip?.tripAiResp.tripDetails.startDate ?? '',
    totalTrips,
  };
};
