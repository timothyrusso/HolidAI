import { useGetGooglePlaceImages } from '@/features/core/images';
import { navigationService } from '@/features/core/navigation';
import { useGetTripById } from '@/features/trips/facades/useGetTripById';
import { useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Animated } from 'react-native';

const MAX_IMAGES = 5;

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

  const locationTitle = activity?.placeName;

  const location = trip?.tripAiResp.tripDetails.location.split(',')[0];

  const imageLocationName = activity?.placeName && location ? `${activity.placeName}, ${location}` : '';

  const { data: allImages, isLoading: isImageLoading } = useGetGooglePlaceImages(imageLocationName, MAX_IMAGES + 1);

  const mainDescription = activity?.placeDetailsLongDescription;

  const activityInsights = activity?.placeSecretsAndInsights;

  const rating = activity?.rating;

  const bestTimeToVisit = activity?.bestTimeToVisit;

  const ticketPricing = activity?.ticketPricing ?? null;
  const currency = trip?.tripAiResp.tripDetails.currency ?? 'N/A';

  const latitude = activity?.geoCoordinates.latitude;
  const longitude = activity?.geoCoordinates.longitude;

  const goBackHandler = () => {
    navigationService.back();
  };

  return {
    scrollOffsetY,
    handleScroll,
    locationTitle,
    imageData: allImages[0]?.url,
    isImageLoading,
    mainDescription,
    activityInsights,
    goBackHandler,
    rating,
    bestTimeToVisit,
    ticketPricing,
    currency,
    latitude,
    longitude,
    carouselImages: allImages.slice(1),
  };
};
