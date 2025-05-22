import { type ZodSchema, z } from 'zod';
import type { TripAiResp } from '../dto/UserTripsDTO';

export const generatedTripSchema = z.object({
  tripDetails: z.object({
    location: z.string(),
    durationDays: z.number(),
    durationNights: z.number(),
    travelers: z.number(),
    budget: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    locale: z.string(),
  }),
  dayPlans: z.array(
    z.object({
      day: z.number(),
      theme: z.string(),
      schedule: z.array(
        z.object({
          placeNumberID: z.number(),
          activity: z.string(),
          placeName: z.string(),
          placeDetails: z.string(),
          placeDetailsLongDescription: z.string(),
          placeSecretsAndInsights: z.string(),
          geoCoordinates: z.object({
            latitude: z.number(),
            longitude: z.number(),
          }),
          rating: z.number(),
          ticketPricing: z.string().describe('Price of the ticket, can be a number or text like "Free" or "Varies"'),
          bestTimeToVisit: z.string(),
        }),
      ),
    }),
  ),
  budgetNotes: z.string(),
  transportationNotes: z.string(),
  weather: z.object({
    weatherGeneralNotes: z.string(),
    averageHighTemperature: z.string(),
    averageLowTemperature: z.string(),
    daylight: z.string(),
    weatherClothingNotes: z.string(),
    weatherSunProtectionNotes: z.string(),
    weatherRainPreparednessNotes: z.string(),
    weatherOutdoorActivitiesNotes: z.string(),
  }),
  food: z.object({
    foodGeneralNotes: z.string(),
    foodBudgetNotes: z.string(),
    typicalDishes: z.array(z.string()),
  }),
}) satisfies ZodSchema<TripAiResp>;
