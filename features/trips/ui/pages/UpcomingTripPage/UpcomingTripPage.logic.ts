import { useGetTrips } from '@/features/trips/facades/useGetTrips';
import { useGetUpcomingTrip } from '@/features/trips/facades/useGetUpcomingTrip';
import { useRetryCoverImage } from '@/features/trips/facades/useRetryCoverImage';

export const useUpcomingTripPageLogic = () => {
  const { upcomingTrip, isLoading } = useGetUpcomingTrip();
  const { totalTrips } = useGetTrips();

  const location = upcomingTrip?.tripAiResp?.tripDetails?.location?.split(',')[0] ?? '';
  const tripId = upcomingTrip?._id;

  const coverImage = upcomingTrip?.tripAiResp?.coverImage;

  const { retryCoverImage } = useRetryCoverImage(tripId, location);

  return {
    lastCreatedTrip: upcomingTrip,
    isLoading,
    image: coverImage?.url,
    imageBlurHash: coverImage?.blurHash || undefined,
    location,
    tripId: tripId ?? '',
    tripStartDate: upcomingTrip?.tripAiResp?.tripDetails?.startDate ?? '',
    totalTrips,
    retryCoverImage,
  };
};
