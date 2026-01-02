import type { Id } from '@/convex/_generated/dataModel';

interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface ScheduleItem {
  placeNumberID: number;
  bestTimeToVisit: string;
  rating: number;
  ticketPricing: string | number;
  placeDetails: string;
  placeDetailsLongDescription: string;
  placeSecretsAndInsights: string;
  geoCoordinates: GeoCoordinates;
  placeName: string;
  activity: string;
}

export interface DayPlan {
  schedule: ScheduleItem[];
  day: number;
  theme: string;
}

export interface TripDetails {
  location: string;
  budget: string;
  travelers: number;
  durationDays: number;
  durationNights: number;
  startDate: string;
  endDate: string;
  locale: string;
}

export interface TripAiResp {
  budgetNotes: string;
  dayPlans: DayPlan[];
  transportationNotes: string;
  tripDetails: TripDetails;
  weather: Weather;
  food: Food;
}

export interface Weather {
  weatherGeneralNotes: string;
  averageHighTemperature: string;
  averageLowTemperature: string;
  daylight: string;
  weatherClothingNotes: string;
  weatherSunProtectionNotes: string;
  weatherRainPreparednessNotes: string;
  weatherOutdoorActivitiesNotes: string;
}

export interface Food {
  foodGeneralNotes: string;
  foodBudgetNotes: string;
  typicalDishes: string[];
}

export interface UserTrips {
  _id: Id<'trips'>;
  tripAiResp: TripAiResp;
  isFavorite: boolean;
  _creationTime: number;
}
