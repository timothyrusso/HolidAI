import { translateDate } from '@/modules/dates/application/getTranslatedDate';
import { useLocale } from '@/modules/shared/hooks/useLocale';
import type { TripDetails } from '@/modules/trips/domain/dto/UserTripsDTO';
import { useGetUserTrips } from '@/ui/queries/trips/query/useGetUserTrips';
import { UrlTypes, useUnsplashImages } from '@/ui/queries/unsplashImages/query/useUnsplashImages';
import { useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Animated } from 'react-native';

export interface AllCoordinates {
  title: string;
  description: string;
  day: number;
  dayIndex: number;
  scheduleIndex: number;
  latitude: number;
  longitude: number;
}

export const useTripDetailsPageLogic = () => {
  const { id } = useLocalSearchParams();
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const { locale } = useLocale();

  const { getTripById } = useGetUserTrips();

  const trip = getTripById(id as string);

  const location = trip?.tripAiResp.tripDetails.location?.split(',')[0] ?? '';

  const { data: imageUrl } = useUnsplashImages(location, UrlTypes.SMALL);

  const title = trip?.tripAiResp.tripDetails.location?.split(',')[0] ?? '';

  // Get all coordinates from the trip plan with day information
  const allCoordinates = trip?.tripAiResp?.dayPlans.flatMap((dayPlan, dayIndex) =>
    dayPlan.schedule.map((item, scheduleIndex) => ({
      ...item.geoCoordinates,
      title: item.placeName,
      description: item.activity,
      day: dayPlan.day,
      dayIndex,
      scheduleIndex,
    })),
  );

  // Calculate the bounds of all coordinates
  const calculateRegion = () => {
    if (allCoordinates?.length === 0) {
      return {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }

    // Find the min and max coordinates
    const latitudes = allCoordinates?.map(coord => coord.latitude);
    const longitudes = allCoordinates?.map(coord => coord.longitude);

    const minLat = Math.min(...(latitudes ?? []));
    const maxLat = Math.max(...(latitudes ?? []));
    const minLng = Math.min(...(longitudes ?? []));
    const maxLng = Math.max(...(longitudes ?? []));

    // Calculate the center point
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    // Calculate deltas with some padding (20% extra space)
    const latDelta = (maxLat - minLat) * 1.5;
    const lngDelta = (maxLng - minLng) * 1.5;

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: Math.max(latDelta, 0.01), // Ensure minimum zoom level
      longitudeDelta: Math.max(lngDelta, 0.01), // Ensure minimum zoom level
    };
  };

  const region = calculateRegion();

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], {
    useNativeDriver: false,
  });

  const sectionData = trip?.tripAiResp?.dayPlans.map(plan => ({
    title: `Day ${plan.day}`,
    data: [plan],
  }));

  const budgetNotes = trip?.tripAiResp?.budgetNotes;
  const transportationNotes = trip?.tripAiResp?.transportationNotes;

  trip?.tripAiResp?.tripDetails;

  const budget = trip?.tripAiResp?.tripDetails?.budget;
  const travelers = trip?.tripAiResp?.tripDetails?.travelers;
  const durationDays = trip?.tripAiResp?.tripDetails?.durationDays;
  const durationNights = trip?.tripAiResp?.tripDetails?.durationNights;

  const weather = trip?.tripAiResp?.weather;
  const food = trip?.tripAiResp?.food;

  const tripDetails: Omit<TripDetails, 'locale' | 'location'> = {
    budget: budget ?? '',
    travelers: travelers ?? 0,
    durationDays: durationDays ?? 0,
    durationNights: durationNights ?? 0,
    startDate: translateDate(locale, trip?.tripAiResp.tripDetails.startDate),
    endDate: translateDate(locale, trip?.tripAiResp.tripDetails.endDate),
  };

  return {
    title,
    allCoordinates,
    region,
    scrollOffsetY,
    handleScroll,
    sectionData,
    budgetNotes,
    transportationNotes,
    tripDetails,
    weather,
    id: trip?._id ?? '',
    imageUrl,
    food,
  };
};
