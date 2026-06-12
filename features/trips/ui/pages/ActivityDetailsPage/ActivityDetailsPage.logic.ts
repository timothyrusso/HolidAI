import type { Id } from '@/convex/_generated/dataModel';
import { IMAGE_RESOLUTION, buildPlacePhotoUrlUseCase } from '@/features/core/images';
import { navigationService } from '@/features/core/navigation';
import { useGetTripById } from '@/features/trips/facades/useGetTripById';
import { useRetryActivityImage } from '@/features/trips/facades/useRetryActivityImage';
import { useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Animated } from 'react-native';

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

  const photoResourceNames = activity?.photoResourceNames ?? [];
  const mainPhotoUrl = photoResourceNames[0]
    ? buildPlacePhotoUrlUseCase.execute(photoResourceNames[0], IMAGE_RESOLUTION.medium)
    : undefined;
  const carouselImages = photoResourceNames
    .slice(1)
    .map(name => ({ url: buildPlacePhotoUrlUseCase.execute(name, IMAGE_RESOLUTION.medium) }));

  const ticketPricing = activity?.ticketPricing ?? null;
  const currency = trip?.tripAiResp.tripDetails.currency ?? 'N/A';

  const goBackHandler = () => {
    navigationService.back();
  };

  return {
    scrollOffsetY,
    handleScroll,
    locationTitle: activity?.placeName,
    imageData: mainPhotoUrl,
    mainDescription: activity?.placeDetailsLongDescription,
    activityInsights: activity?.placeSecretsAndInsights,
    goBackHandler,
    rating: activity?.rating,
    bestTimeToVisit: activity?.bestTimeToVisit,
    ticketPricing,
    currency,
    latitude: activity?.geoCoordinates.latitude,
    longitude: activity?.geoCoordinates.longitude,
    carouselImages,
    retryActivityImage,
  };
};
