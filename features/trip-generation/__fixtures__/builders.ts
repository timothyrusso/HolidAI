import type { GeneratedTrip } from '@/features/ai';
import type { GenerateTripParams } from '@/features/trip-generation/useCases/generateTrip';

export const aTripRequest = (overrides: Partial<GenerateTripParams> = {}): GenerateTripParams => ({
  location: 'Kyoto, Japan',
  totalNoOfDays: 4,
  travelersNumber: 2,
  travelerType: 'Couple',
  budgetInfo: 'Moderate',
  startDate: new Date('2026-05-12T00:00:00Z'),
  endDate: new Date('2026-05-15T00:00:00Z'),
  locale: 'en',
  ...overrides,
});

export const aGeneratedTrip = (overrides: Partial<GeneratedTrip> = {}): GeneratedTrip => ({
  tripDetails: {
    location: 'Kyoto, Japan',
    budget: 'Moderate',
    travelers: 2,
    durationDays: 4,
    durationNights: 3,
    startDate: '2026-05-12',
    endDate: '2026-05-15',
    locale: 'en',
    currency: 'JPY',
  },
  dayPlans: [
    {
      day: 1,
      theme: 'Temples of Higashiyama',
      schedule: [
        {
          placeNumberID: 1,
          bestTimeToVisit: 'Early morning',
          rating: 4.7,
          ticketPricing: 400,
          placeDetails: 'Hillside temple with a wooden stage over the forest.',
          placeDetailsLongDescription: 'Kiyomizu-dera is one of the most celebrated temples in Japan.',
          placeSecretsAndInsights: 'Arrive before 7am to have the stage almost to yourself.',
          geoCoordinates: { latitude: 34.9948, longitude: 135.785 },
          placeName: 'Kiyomizu-dera',
          activity: 'Walk the stage of Kiyomizu-dera',
          photoResourceNames: [],
        },
      ],
    },
  ],
  budgetNotes: 'Around 15,000 JPY per person per day covers food, transport and entries.',
  transportationNotes: 'Buy an ICOCA card; buses reach most temples.',
  weather: {
    weatherGeneralNotes: 'Mild and mostly sunny in mid May.',
    averageHighTemperature: '24°C',
    averageLowTemperature: '14°C',
    daylight: '14 hours',
    weatherClothingNotes: 'Layers and comfortable walking shoes.',
    weatherSunProtectionNotes: 'Sunscreen and a hat for the afternoons.',
    weatherRainPreparednessNotes: 'Carry a compact umbrella.',
    weatherOutdoorActivitiesNotes: 'Ideal for gardens and hikes.',
  },
  food: {
    foodGeneralNotes: 'Kyoto is known for kaiseki and tofu cuisine.',
    foodBudgetNotes: 'Lunch sets are the best value.',
    typicalDishes: [
      {
        name: 'Yudofu',
        searchTerm: 'yudofu',
        description: 'Tofu simmered in a kombu broth, served with soy sauce and condiments.',
        ingredients: ['tofu', 'kombu', 'soy sauce'],
        isGlutenFree: false,
        isVegetarian: true,
        isVegan: true,
        imageUrl: '',
      },
    ],
  },
  coverImage: { url: '', blurHash: '' },
  ...overrides,
});
