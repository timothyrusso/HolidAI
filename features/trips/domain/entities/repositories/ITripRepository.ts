// Pragmatic exception to domain purity: see Trip.ts for rationale.
import type { Id } from '@/convex/_generated/dataModel';
import type { Result } from '@/features/core/error';
import type { CoverImage } from '@/features/trips/domain/entities/CoverImage';
import type { Trip, TripAiResp } from '@/features/trips/domain/entities/Trip';

export interface ITripRepository {
  getTrips(): readonly Trip[] | undefined;
  addTrip(params: { userId: string; tripAiResp: TripAiResp; isFavorite: boolean }): Promise<Result<Id<'trips'>>>;
  deleteAllTrips(userId: string): Promise<Result<void>>;
  deleteTrip(id: Id<'trips'>): Promise<Result<void>>;
  toggleFavoriteTrip(params: { id: Id<'trips'>; isFavorite: boolean }): Promise<Result<void>>;
  updateActivityPhotos(params: {
    id: Id<'trips'>;
    placeNumberID: number;
    photoResourceNames: string[];
  }): Promise<Result<void>>;
  updateDishImage(params: { id: Id<'trips'>; searchTerm: string; imageUrl: string }): Promise<Result<void>>;
  updateCoverImage(params: { id: Id<'trips'>; coverImage: CoverImage }): Promise<Result<void>>;
}
