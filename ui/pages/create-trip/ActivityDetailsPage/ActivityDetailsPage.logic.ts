import { useGooglePlaceImagesQuery } from '@/ui/queries/googlePlaceImages/query/useGooglePlaceImagesQuery';
import { useGetUserTripsQuery } from '@/ui/queries/trips/query/useGetUserTripsQuery';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef } from 'react';
import { Animated } from 'react-native';

export const useActivityDetailsPageLogic = () => {
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const { tripId, activityId } = useLocalSearchParams();

  const { data: activityData } = useGetUserTripsQuery();

  const activity = activityData?.selectActivityById(tripId as string, Number(activityId));

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], {
    useNativeDriver: false,
  });

  const locationTitle = activity?.placeName;

  const location = activityData?.selectTripById(tripId as string)?.tripAiResp.tripDetails.location.split(',')[0];

  const imageLocationName = `${activity?.placeName}, ${location}`;

  const { data: imageData, isLoading: isImageLoading } = useGooglePlaceImagesQuery(imageLocationName, 400);

  const mainDescription = activity?.placeDetailsLongDescription;

  const activityInsights = activity?.placeSecretsAndInsights;

  const rating = activity?.rating;

  const bestTimeToVisit = activity?.bestTimeToVisit;

  const ticketPricing = activity?.ticketPricing;

  const latitude = activity?.geoCoordinates.latitude;
  const longitude = activity?.geoCoordinates.longitude;

  const goBackHandler = () => {
    router.back();
  };

  return {
    scrollOffsetY,
    handleScroll,
    locationTitle,
    imageData,
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
