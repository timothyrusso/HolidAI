import { useGetGooglePlaceImage } from '@/features/core/images';
import { navigationService } from '@/features/core/navigation';
import { useGetUserTrips } from '@/ui/queries/trips/query/useGetUserTrips';
import { useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Animated } from 'react-native';

export const useActivityDetailsPageLogic = () => {
  const scrollOffsetY = useRef(new Animated.Value(0)).current;

  const { tripId, activityId } = useLocalSearchParams();

  const { getActivityById, getTripById } = useGetUserTrips();

  const activity = getActivityById(tripId as string, Number(activityId));

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], {
    useNativeDriver: false,
  });

  const locationTitle = activity?.placeName;

  const location = getTripById(tripId as string)?.tripAiResp.tripDetails.location.split(',')[0];

  const imageLocationName = `${activity?.placeName}, ${location}`;

  const { data: imageResult, isLoading: isImageLoading } = useGetGooglePlaceImage(imageLocationName, 400);

  const mainDescription = activity?.placeDetailsLongDescription;

  const activityInsights = activity?.placeSecretsAndInsights;

  const rating = activity?.rating;

  const bestTimeToVisit = activity?.bestTimeToVisit;

  const ticketPricing = activity?.ticketPricing;

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
    latitude,
    longitude,
  };
};
