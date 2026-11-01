import { useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Animated } from 'react-native';
import type { Id } from '@/convex/_generated/dataModel';
import { IMAGE_RESOLUTION, usePlacePhotoUrls } from '@/features/core/images';
import { navigationService } from '@/features/core/navigation';
import { useGetTripById } from '@/features/trips/facades/useGetTripById';
import { useRetryActivityImage } from '@/features/trips/facades/useRetryActivityImage';

export const useActivityDetailsPageLogic = () => {
  const scrollOffsetY = useRef(new Animated.Value(0)).current;

  const { tripId, activityId } = useLocalSearchParams<{ tripId: string; activityId: string }>();

  const { trip } = useGetTripById(tripId as string);

  const activity = trip?.tripAiResp.dayPlans
    .flatMap(dayPlan => dayPlan.schedule)
    .find(a => a.placeNumberID === Number(activityId));

  const location = trip?.tripAiResp.tripDetails.location.split(',')[0] ?? '';
  const { retryActivityImage } = useRetryActivityImage(
    tripId as Id<'trips'>,
    activity?.placeNumberID ?? 0,
    activity?.placeName ?? '',
    location,
  );

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], {
    useNativeDriver: false,
  });

  const [mainPhotoUrl, ...otherPhotoUrls] = usePlacePhotoUrls(
    activity?.photoResourceNames ?? [],
    IMAGE_RESOLUTION.medium,
  );
  const carouselImages = otherPhotoUrls.map(url => ({ url }));

  const ticketPricing = activity?.ticketPricing ?? null;
  const currency = trip?.tripAiResp.tripDetails.currency ?? 'N/A';

  const goBackHandler = () => {
    navigationService.back();
  };

  return {
    state: {
      scrollOffsetY,
      locationTitle: activity?.placeName,
      mainDescription: activity?.placeDetailsLongDescription,
      activityInsights: activity?.placeSecretsAndInsights,
      rating: activity?.rating,
      bestTimeToVisit: activity?.bestTimeToVisit,
      ticketPricing,
      currency,
      latitude: activity?.geoCoordinates.latitude,
      longitude: activity?.geoCoordinates.longitude,
    },
    derived: {
      imageData: mainPhotoUrl,
      carouselImages,
    },
    effects: {
      handleScroll,
      goBackHandler,
      retryActivityImage,
    },
  };
};
