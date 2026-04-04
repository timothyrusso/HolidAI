import { UrlType, useGetUnsplashImage } from '@/features/core/images';
import { useGetUserTrips } from '@/ui/queries/trips/query/useGetUserTrips';

export const useHomePageLogic = () => {
  const { isLoading, getUpcomingTrip, getTotalTrips } = useGetUserTrips();

  const lastCreatedTrip = getUpcomingTrip();

  const location = lastCreatedTrip?.tripAiResp.tripDetails.location?.split(',')[0] ?? '';

  const { data: unsplashImage } = useGetUnsplashImage(location, UrlType.FULL);

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
