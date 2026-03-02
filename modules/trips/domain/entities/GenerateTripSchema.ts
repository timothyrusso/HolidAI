import { normalizeDateToISOUseCase } from '@/modules/dates/application/normalizeDateToISOUseCase';
import { type ZodSchema, z } from 'zod';
import type { TripAiResp } from '../dto/UserTripsDTO';

export const generatedTripSchema = z.object({
  tripDetails: z.object({
    location: z.string(),
    budget: z.string(),
    travelers: z.number(),
    durationDays: z.number(),
    durationNights: z.number(),
    startDate: z.string().describe('Date in ISO format YYYY-MM-DD').transform(normalizeDateToISOUseCase),
    endDate: z.string().describe('Date in ISO format YYYY-MM-DD').transform(normalizeDateToISOUseCase),
    locale: z.string(),
  }),
  dayPlans: z.array(
    z.object({
      day: z.number(),
      theme: z.string(),
      schedule: z.array(
        z.object({
          placeNumberID: z
            .number()
            .describe(
              'A unique identifier for the place in the schedule. The identifier must be unique across all days in the schedule, including past days.',
            ),
          bestTimeToVisit: z.string(),
          rating: z.number(),
          ticketPricing: z.string().describe('Price of the ticket, can be a number or text like "Free" or "Varies"'),
          placeDetails: z.string(),
          placeDetailsLongDescription: z.string(),
          placeSecretsAndInsights: z.string(),
          geoCoordinates: z.object({
            latitude: z.number(),
            longitude: z.number(),
          }),
          placeName: z.string(),
          activity: z.string().describe('Should include the name of the place'),
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
