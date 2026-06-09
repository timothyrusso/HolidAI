import { useGetTrips } from '@/features/trips/facades/useGetTrips';
import { useGetUpcomingTrip } from '@/features/trips/facades/useGetUpcomingTrip';

export const useUpcomingTripPageLogic = () => {
  const { upcomingTrip, isLoading } = useGetUpcomingTrip();
  const { totalTrips } = useGetTrips();

  const location = upcomingTrip?.tripAiResp?.tripDetails?.location?.split(',')[0] ?? '';

  const coverImage = upcomingTrip?.tripAiResp?.coverImage;

  return {
    lastCreatedTrip: upcomingTrip,
    isLoading,
    image: coverImage?.url,
    imageBlurHash: coverImage?.blurHash || undefined,
    location,
    tripId: upcomingTrip?._id ?? '',
    tripStartDate: upcomingTrip?.tripAiResp?.tripDetails?.startDate ?? '',
    totalTrips,
  };
};
