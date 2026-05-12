// Pragmatic exception to domain purity: Id<'trips'> is a Convex branded string type used
// throughout the Convex query/mutation API. Replacing it with a plain string would require
// an adapter layer at every data boundary — a significant refactoring with high breakage risk
// for minimal architectural gain, since Id<'trips'> carries no runtime behavior.
import type { Id } from '@/convex/_generated/dataModel';
import type { DayPlan } from '@/features/trips/domain/entities/DayPlan';
import type { Food } from '@/features/trips/domain/entities/Food';
import type { TripDetails } from '@/features/trips/domain/entities/TripDetails';
import type { Weather } from '@/features/trips/domain/entities/Weather';

export interface TripAiResp {
  budgetNotes: string;
  dayPlans: DayPlan[];
  transportationNotes: string;
  tripDetails: TripDetails;
  weather: Weather;
  food: Food;
}

export interface Trip {
  _id: Id<'trips'>;
  tripAiResp: TripAiResp;
  isFavorite: boolean;
  _creationTime: number;
}
