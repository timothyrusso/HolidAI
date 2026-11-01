import type { Id } from '@/convex/_generated/dataModel';
import type { ScheduleItem } from '@/features/trips/domain/entities/ScheduleItem';
import type { Trip, TripAiResp } from '@/features/trips/domain/entities/Trip';
import type { TypicalDish } from '@/features/trips/domain/entities/TypicalDish';

export const aTripId = (id = 'trip_lisbon') => id as Id<'trips'>;

export const anActivity = (overrides: Partial<ScheduleItem> = {}): ScheduleItem => ({
  placeNumberID: 1,
  bestTimeToVisit: 'Morning',
  rating: 4.6,
  ticketPricing: 10,
  placeDetails: 'A monastery in the Manueline style.',
  placeDetailsLongDescription: 'The Jerónimos Monastery was built to celebrate Vasco da Gama.',
  placeSecretsAndInsights: 'The cloister is quietest just after opening.',
  geoCoordinates: { latitude: 38.6979, longitude: -9.2063 },
  placeName: 'Jerónimos Monastery',
  activity: 'Visit the Jerónimos Monastery',
  photoResourceNames: ['places/ChIJ1/photos/AU1', 'places/ChIJ1/photos/AU2'],
  ...overrides,
});

export const aDish = (overrides: Partial<TypicalDish> = {}): TypicalDish => ({
  name: 'Pastel de nata',
  searchTerm: 'pastel de nata',
  description: 'A custard tart with a flaky crust.',
  ingredients: ['eggs', 'cream', 'puff pastry'],
  isGlutenFree: false,
  isVegetarian: true,
  isVegan: false,
  imageUrl: 'https://upload.wikimedia.org/pastel-de-nata.jpg',
  ...overrides,
});

export const aTripAiResp = (overrides: Partial<TripAiResp> = {}): TripAiResp => ({
  tripDetails: {
    location: 'Lisbon, Portugal',
    budget: 'Moderate',
    travelers: 2,
    durationDays: 2,
    durationNights: 1,
    startDate: '2026-11-11',
    endDate: '2026-11-12',
    locale: 'en',
    currency: 'EUR',
  },
  dayPlans: [
    {
      day: 1,
      theme: 'Belém',
      schedule: [
        anActivity(),
        anActivity({
          placeNumberID: 2,
          placeName: 'Belém Tower',
          activity: 'Climb the Belém Tower',
          ticketPricing: 0,
          geoCoordinates: { latitude: 38.6916, longitude: -9.216 },
          photoResourceNames: ['places/ChIJ2/photos/AU1'],
        }),
      ],
    },
  ],
  budgetNotes: 'Around 80 EUR per person per day.',
  transportationNotes: 'Tram 15 runs to Belém.',
  weather: {
    weatherGeneralNotes: 'Mild and rainy in November.',
    averageHighTemperature: '18°C',
    averageLowTemperature: '11°C',
    daylight: '10 hours',
    weatherClothingNotes: 'A light jacket.',
    weatherSunProtectionNotes: 'Sunglasses for the clear days.',
    weatherRainPreparednessNotes: 'An umbrella.',
    weatherOutdoorActivitiesNotes: 'Good for walking tours.',
  },
  food: {
    foodGeneralNotes: 'Seafood and pastries.',
    foodBudgetNotes: 'A prato do dia is the best value.',
    typicalDishes: [aDish(), aDish({ name: 'Bacalhau à Brás', searchTerm: 'bacalhau a bras', isVegetarian: false })],
  },
  coverImage: { url: 'https://images.unsplash.com/lisbon-regular', blurHash: 'LKO2?U%2Tw=w' },
  ...overrides,
});

export const aTrip = (overrides: Partial<Trip> = {}): Trip => ({
  _id: aTripId(),
  tripAiResp: aTripAiResp(),
  isFavorite: false,
  _creationTime: 1_700_000_000_000,
  ...overrides,
});
