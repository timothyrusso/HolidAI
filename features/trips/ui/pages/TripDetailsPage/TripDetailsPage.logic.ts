import { translateDateUseCase } from '@/features/core/dates';
import { UrlType, useGetUnsplashImage } from '@/features/core/images';
import { useLocale } from '@/features/core/translations';
import type { TripDetails } from '@/features/trips/domain/entities/TripDetails';
import { useGetTripById } from '@/features/trips/facades/useGetTripById';

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
  const { id } = useLocalSearchParams<{ id: string }>();
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const { locale } = useLocale();

  const { trip } = useGetTripById(id);

  const location = trip?.tripAiResp.tripDetails.location?.split(',')[0] ?? '';

  const { data: unsplashImage } = useGetUnsplashImage(location, UrlType.REGULAR);
  const imageUrl = unsplashImage?.url;
  const imageBlurHash = unsplashImage?.blurHash;

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

  const calculateRegion = () => {
    if (!allCoordinates || allCoordinates.length === 0) {
      return {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }

    const latitudes = allCoordinates.map(coord => coord.latitude);
    const longitudes = allCoordinates.map(coord => coord.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    const latDelta = (maxLat - minLat) * 1.5;
    const lngDelta = (maxLng - minLng) * 1.5;

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: Math.max(latDelta, 0.01),
      longitudeDelta: Math.max(lngDelta, 0.01),
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
    startDate: translateDateUseCase.execute(locale, trip?.tripAiResp.tripDetails.startDate),
    endDate: translateDateUseCase.execute(locale, trip?.tripAiResp.tripDetails.endDate),
    currency: trip?.tripAiResp.tripDetails.currency ?? 'N/A',
  };

  return {
    location,
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
    imageBlurHash,
    food,
    currency: trip?.tripAiResp.tripDetails.currency ?? 'N/A',
  };
};
