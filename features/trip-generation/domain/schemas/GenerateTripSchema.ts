import { z } from 'zod';
import { normalizeDateToISO } from '@/features/trip-generation/domain/schemas/normalizeDateToISO';

export const generatedTripSchema = z.object({
  tripDetails: z.object({
    location: z.string(),
    budget: z.string(),
    travelers: z.number(),
    durationDays: z.number(),
    durationNights: z.number(),
    startDate: z.string().describe('Date in ISO format YYYY-MM-DD').transform(normalizeDateToISO),
    endDate: z.string().describe('Date in ISO format YYYY-MM-DD').transform(normalizeDateToISO),
    locale: z.string(),
    currency: z.string().describe('ISO 4217 currency code for the destination, e.g. "EUR", "USD", "JPY"'),
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
          rating: z.number().min(0).max(5).describe('Rating on a 0-5 scale'),
          ticketPricing: z
            .number()
            .nullable()
            .describe('Price of the ticket in local currency. Use 0 for free admission, null if unknown.'),
          placeDetails: z.string().describe('Maximum 20 words. A brief description of the place.'),
          placeDetailsLongDescription: z.string(),
          placeSecretsAndInsights: z.string(),
          geoCoordinates: z.object({
            latitude: z.number(),
            longitude: z.number(),
          }),
          placeName: z.string(),
          activity: z.string().describe('Should include the name of the place'),
          photoResourceNames: z.array(z.string()).default([]),
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
    typicalDishes: z.array(
      z.object({
        name: z
          .string()
          .describe(
            'Local name of the dish in its native language. Just the dish name — no qualifiers, no parentheses, no descriptions, no cooking methods. E.g. "Casoncelli", "Papanași", "Pierogi Ruskie".',
          ),
        searchTerm: z
          .string()
          .describe(
            'Search-optimized English term for Wikimedia Commons image lookup. Lowercase, no diacritics, no special characters, no articles, max 3 words. E.g. "casoncelli", "papanasi", "pierogi ruskie".',
          ),
        description: z
          .string()
          .describe(
            'Description of the dish. Minimum 20 words, maximum 50 words. Should include main ingredients and cooking method.',
          ),
        ingredients: z.array(z.string()).describe('Main ingredients of the dish.'),
        isGlutenFree: z.boolean().describe('Whether the dish is gluten free.'),
        isVegetarian: z.boolean().describe('Whether the dish is vegetarian.'),
        isVegan: z.boolean().describe('Whether the dish is vegan.'),
        imageUrl: z.string().default(''),
      }),
    ),
  }),
  coverImage: z.object({ url: z.string().default(''), blurHash: z.string().default('') }),
});
