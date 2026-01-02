import { v } from 'convex/values';

export const GeoCoordinates = v.object({
  latitude: v.number(),
  longitude: v.number(),
});

export const ScheduleItem = v.object({
  placeNumberID: v.number(),
  bestTimeToVisit: v.string(),
  rating: v.number(),
  ticketPricing: v.union(v.string(), v.number()),
  placeDetails: v.string(),
  placeDetailsLongDescription: v.string(),
  placeSecretsAndInsights: v.string(),
  geoCoordinates: GeoCoordinates,
  placeName: v.string(),
  activity: v.string(),
});

export const DayPlan = v.object({
  schedule: v.array(ScheduleItem),
  day: v.number(),
  theme: v.string(),
});

export const TripDetails = v.object({
  location: v.string(),
  budget: v.string(),
  travelers: v.number(),
  durationDays: v.number(),
  durationNights: v.number(),
  startDate: v.string(),
  endDate: v.string(),
  locale: v.string(),
});

export const Weather = v.object({
  weatherGeneralNotes: v.string(),
  averageHighTemperature: v.string(),
  averageLowTemperature: v.string(),
  daylight: v.string(),
  weatherClothingNotes: v.string(),
  weatherSunProtectionNotes: v.string(),
  weatherRainPreparednessNotes: v.string(),
  weatherOutdoorActivitiesNotes: v.string(),
});

export const Food = v.object({
  foodGeneralNotes: v.string(),
  foodBudgetNotes: v.string(),
  typicalDishes: v.array(v.string()),
});

export const TripAiResp = v.object({
  budgetNotes: v.string(),
  dayPlans: v.array(DayPlan),
  transportationNotes: v.string(),
  tripDetails: TripDetails,
  weather: Weather,
  food: Food,
});

export const Trips = v.object({
  tripId: v.string(),
  userId: v.string(),
  tripAiResp: TripAiResp,
  isFavorite: v.boolean(),
  createdAt: v.string(),
});
