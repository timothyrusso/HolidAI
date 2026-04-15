import { useGetGooglePlaceImage } from '@/features/core/images';
import { navigationService } from '@/features/core/navigation';
import { useGetTripById } from '@/features/trips/facades/useGetTripById';
import { useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Animated } from 'react-native';

export const useActivityDetailsPageLogic = () => {
  const scrollOffsetY = useRef(new Animated.Value(0)).current;

  const { tripId, activityId } = useLocalSearchParams();

  const { trip } = useGetTripById(tripId as string);

  const activity = trip?.tripAiResp.dayPlans
    .find(dayPlan => dayPlan.schedule.find(a => a.placeNumberID === Number(activityId)))
    ?.schedule.find(a => a.placeNumberID === Number(activityId));

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], {
    useNativeDriver: false,
  });

  const locationTitle = activity?.placeName;

  const location = trip?.tripAiResp.tripDetails.location.split(',')[0];

  const imageLocationName = `${activity?.placeName}, ${location}`;

  const { data: imageResult, isLoading: isImageLoading } = useGetGooglePlaceImage(imageLocationName, 600);

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
    imageData: imageResult?.url,
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
  };
};
