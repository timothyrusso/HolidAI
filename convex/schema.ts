import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const Trips = defineTable({
  tripDetails: v.object({
    location: v.string(),
    durationDays: v.number(),
    durationNights: v.number(),
    travelers: v.number(),
    budget: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    locale: v.string(),
  }),
  dayPlans: v.array(
    v.object({
      day: v.number(),
      theme: v.string(),
      schedule: v.array(
        v.object({
          placeNumberID: v.number(),
          activity: v.string(),
          placeName: v.string(),
          placeDetails: v.string(),
          placeDetailsLongDescription: v.string(),
          placeSecretsAndInsights: v.string(),
          geoCoordinates: v.object({
            latitude: v.number(),
            longitude: v.number(),
          }),
          rating: v.number(),
          ticketPricing: v.union(v.number(), v.string()),
          bestTimeToVisit: v.string(),
        }),
      ),
      weather: v.object({
        weatherGeneralNotes: v.string(),
        averageHighTemperature: v.string(),
        averageLowTemperature: v.string(),
        daylight: v.string(),
        weatherClothingNotes: v.string(),
        weatherSunProtectionNotes: v.string(),
        weatherRainPreparednessNotes: v.string(),
        weatherOutdoorActivitiesNotes: v.string(),
      }),
      food: v.object({
        foodGeneralNotes: v.string(),
        typicalDishes: v.array(v.string()),
        foodBudgetNotes: v.string(),
      }),
      budgetNotes: v.string(),
      transportationNotes: v.string(),
    }),
  ),
});

export const Users = defineTable({
  email: v.string(),
  password: v.string(),
  name: v.string(),
  surname: v.string(),
  locale: v.string(),
});

export default defineSchema({
  trips: Trips,
  users: Users,
});
