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
