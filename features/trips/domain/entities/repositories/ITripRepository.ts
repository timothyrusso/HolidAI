import type { Id } from '@/convex/_generated/dataModel';
import type { Result } from '@/features/core/error';
import type { Trip, TripAiResp } from '@/features/trips/domain/entities/Trip';

export interface ITripRepository {
  getTrips(): readonly Trip[] | undefined;
  addTrip(params: { userId: string; tripAiResp: TripAiResp; isFavorite: boolean }): Promise<Result<Id<'trips'>>>;
  deleteAllTrips(userId: string): Promise<Result<void>>;
  deleteTrip(id: Id<'trips'>): Promise<Result<void>>;
  toggleFavoriteTrip(params: { id: Id<'trips'>; isFavorite: boolean }): Promise<Result<void>>;
}
