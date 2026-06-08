import { buildPlacePhotoUrlUseCase } from '@/features/core/images';
import { navigationService } from '@/features/core/navigation';
import { useGetTripById } from '@/features/trips/facades/useGetTripById';
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

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], {
    useNativeDriver: false,
  });

  const photoResourceNames = activity?.photoResourceNames ?? [];
  const mainPhotoUrl = photoResourceNames[0]
    ? buildPlacePhotoUrlUseCase.execute(photoResourceNames[0], 500)
    : undefined;
  const carouselImages = photoResourceNames
    .slice(1)
    .map(name => ({ url: buildPlacePhotoUrlUseCase.execute(name, 500) }));

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
  };
};
