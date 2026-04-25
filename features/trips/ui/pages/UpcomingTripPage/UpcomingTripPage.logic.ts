import { UrlType, useGetUnsplashImage } from '@/features/core/images';
import { useGetTrips } from '@/features/trips/facades/useGetTrips';
import { useGetUpcomingTrip } from '@/features/trips/facades/useGetUpcomingTrip';

export const useUpcomingTripPageLogic = () => {
  const { upcomingTrip, isLoading } = useGetUpcomingTrip();
  const { totalTrips } = useGetTrips();

  const location = upcomingTrip?.tripAiResp.tripDetails.location?.split(',')[0] ?? '';

  const { data: unsplashImage } = useGetUnsplashImage(location, UrlType.FULL);

  return {
    lastCreatedTrip: upcomingTrip,
    isLoading,
    image: unsplashImage?.url,
    imageBlurHash: unsplashImage?.blurHash,
    location,
    tripId: upcomingTrip?._id ?? '',
    tripStartDate: upcomingTrip?.tripAiResp.tripDetails.startDate ?? '',
    totalTrips,
  };
};
