import { Schema } from 'effect';
import { normalizeDateToISO } from '@/features/ai/domain/utils/normalizeDateToISO';

/** A date the model wrote, in ISO (YYYY-MM-DD) once decoded. */
const IsoDate = Schema.transform(Schema.String, Schema.String, {
  strict: true,
  decode: normalizeDateToISO,
  encode: date => date,
});

/** A mutable array, so a decoded trip is the `TripAiResp` the trips feature saves. */
const ArrayOf = <A, I>(item: Schema.Schema<A, I>) => Schema.mutable(Schema.Array(item));

const ScheduleItem = Schema.Struct({
  placeNumberID: Schema.Number,
  bestTimeToVisit: Schema.String,
  rating: Schema.Number.pipe(Schema.between(0, 5)),
  ticketPricing: Schema.NullOr(Schema.Number),
  placeDetails: Schema.String,
  placeDetailsLongDescription: Schema.String,
  placeSecretsAndInsights: Schema.String,
  geoCoordinates: Schema.Struct({ latitude: Schema.Number, longitude: Schema.Number }),
  placeName: Schema.String,
  activity: Schema.String,
  photoResourceNames: Schema.optionalWith(ArrayOf(Schema.String), { default: () => [] }),
});

const TypicalDish = Schema.Struct({
  name: Schema.String,
  searchTerm: Schema.String,
  description: Schema.String,
  ingredients: ArrayOf(Schema.String),
  isGlutenFree: Schema.Boolean,
  isVegetarian: Schema.Boolean,
  isVegan: Schema.Boolean,
  imageUrl: Schema.optionalWith(Schema.String, { default: () => '' }),
});

/**
 * A trip as the model generates it, the domain's view of `GeneratedTripResponseDTO`: both accept
 * the same answers. Dates are normalized to ISO, and the fields the enrichment fills later
 * (photos, dish images, cover image) default to empty.
 */
export const GeneratedTripSchema = Schema.Struct({
  tripDetails: Schema.Struct({
    location: Schema.String,
    budget: Schema.String,
    travelers: Schema.Number,
    durationDays: Schema.Number,
    durationNights: Schema.Number,
    startDate: IsoDate,
    endDate: IsoDate,
    locale: Schema.String,
    currency: Schema.String,
  }),
  dayPlans: ArrayOf(Schema.Struct({ day: Schema.Number, theme: Schema.String, schedule: ArrayOf(ScheduleItem) })),
  budgetNotes: Schema.String,
  transportationNotes: Schema.String,
  weather: Schema.Struct({
    weatherGeneralNotes: Schema.String,
    averageHighTemperature: Schema.String,
    averageLowTemperature: Schema.String,
    daylight: Schema.String,
    weatherClothingNotes: Schema.String,
    weatherSunProtectionNotes: Schema.String,
    weatherRainPreparednessNotes: Schema.String,
    weatherOutdoorActivitiesNotes: Schema.String,
  }),
  food: Schema.Struct({
    foodGeneralNotes: Schema.String,
    foodBudgetNotes: Schema.String,
    typicalDishes: ArrayOf(TypicalDish),
  }),
  coverImage: Schema.Struct({
    url: Schema.optionalWith(Schema.String, { default: () => '' }),
    blurHash: Schema.optionalWith(Schema.String, { default: () => '' }),
  }),
});

export type GeneratedTrip = typeof GeneratedTripSchema.Type;
