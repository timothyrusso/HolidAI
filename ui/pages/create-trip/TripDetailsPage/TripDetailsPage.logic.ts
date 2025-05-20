import { translateDate } from '@/modules/dates/application/getTranslatedDate';
import type { TripAiResp, TripDetails, UserTripData, UserTrips } from '@/modules/trip/domain/dto/UserTripsDTO';
import { useLocale } from '@/ui/hooks/useLocale';
import { format } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
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
  const { trip } = useLocalSearchParams();
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const [isLoadingMainImage, setIsLoadingMainImage] = useState(true);
  const { locale } = useLocale();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingMainImage(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // TODO: fix type
  const _tripData = JSON.parse(trip as string) as UserTrips & UserTripData & TripAiResp & { image: string; id: string };

  const _tripDays = `${format(_tripData.startDate ?? new Date(), 'dd MMM yyyy')} - ${format(_tripData.endDate ?? new Date(), 'dd MMM yy')}`;

  const title = _tripData?.location?.split(',')[0];

  // Get all coordinates from the trip plan with day information
  const allCoordinates = _tripData.dayPlans.flatMap((dayPlan, dayIndex) =>
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
    if (allCoordinates.length === 0) {
      return {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }

    // Find the min and max coordinates
    const latitudes = allCoordinates.map(coord => coord.latitude);
    const longitudes = allCoordinates.map(coord => coord.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

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

  const sectionData = _tripData.dayPlans.map(plan => ({
    title: `Day ${plan.day}`,
    data: [plan],
  }));

  const budgetNotes = _tripData.budgetNotes;
  const transportationNotes = _tripData.transportationNotes;

  const { budget, travelers, durationDays, durationNights } = _tripData.tripDetails;
  const weather = _tripData.weather;

  const tripDetails: Omit<TripDetails, 'location'> & { startDate: string; endDate: string } = {
    budget,
    travelers,
    durationDays,
    durationNights,
    startDate: translateDate(locale, _tripData.startDate),
    endDate: translateDate(locale, _tripData.endDate),
  };

  return {
    _tripData,
    _tripDays,
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
    isLoadingMainImage,
  };
};
