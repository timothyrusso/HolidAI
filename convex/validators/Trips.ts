import { v } from 'convex/values';

export const GeoCoordinates = v.object({
  latitude: v.optional(v.number()),
  longitude: v.optional(v.number()),
});

export const ScheduleItem = v.object({
  placeNumberID: v.optional(v.number()),
  bestTimeToVisit: v.optional(v.string()),
  rating: v.optional(v.number()),
  ticketPricing: v.optional(v.union(v.string(), v.number())),
  placeDetails: v.optional(v.string()),
  placeDetailsLongDescription: v.optional(v.string()),
  placeSecretsAndInsights: v.optional(v.string()),
  geoCoordinates: GeoCoordinates,
  placeName: v.optional(v.string()),
  activity: v.optional(v.string()),
});

export const DayPlan = v.object({
  schedule: v.array(ScheduleItem),
  day: v.optional(v.number()),
  theme: v.optional(v.string()),
});

export const TripDetails = v.object({
  location: v.optional(v.string()),
  budget: v.optional(v.string()),
  travelers: v.optional(v.number()),
  durationDays: v.optional(v.number()),
  durationNights: v.optional(v.number()),
  startDate: v.optional(v.string()),
  endDate: v.optional(v.string()),
  locale: v.optional(v.string()),
});

export const Weather = v.object({
  weatherGeneralNotes: v.optional(v.string()),
  averageHighTemperature: v.optional(v.string()),
  averageLowTemperature: v.optional(v.string()),
  daylight: v.optional(v.string()),
  weatherClothingNotes: v.optional(v.string()),
  weatherSunProtectionNotes: v.optional(v.string()),
  weatherRainPreparednessNotes: v.optional(v.string()),
  weatherOutdoorActivitiesNotes: v.optional(v.string()),
});

export const Food = v.object({
  foodGeneralNotes: v.optional(v.string()),
  foodBudgetNotes: v.optional(v.string()),
  typicalDishes: v.array(v.string()),
});

export const TripAiResp = v.object({
  budgetNotes: v.optional(v.string()),
  dayPlans: v.optional(v.array(DayPlan)),
  transportationNotes: v.optional(v.string()),
  tripDetails: TripDetails,
  weather: Weather,
  food: Food,
});

export const Trips = v.object({
  tripId: v.optional(v.string()),
  userId: v.optional(v.string()),
  tripAiResp: TripAiResp,
  isFavorite: v.optional(v.boolean()),
  createdAt: v.optional(v.string()),
});
