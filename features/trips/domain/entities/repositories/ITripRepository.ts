// NOTE: pragmatic exception to domain purity: see `Trip.ts` for the rationale.
import type { Effect } from 'effect';
import type { Id } from '@/convex/_generated/dataModel';
import type { UnexpectedError } from '@/features/core/error';
import type { CoverImage } from '@/features/trips/domain/entities/CoverImage';
import type { Trip, TripAiResp } from '@/features/trips/domain/entities/Trip';

/** The signed-in user's trips over Convex: a live list, and mutations as Effects. */
export interface ITripRepository {
  /** The user's trips, `undefined` while they load. */
  getTrips(): readonly Trip[] | undefined;
  addTrip(params: {
    userId: string;
    tripAiResp: TripAiResp;
    isFavorite: boolean;
  }): Effect.Effect<Id<'trips'>, UnexpectedError>;
  deleteTrip(id: Id<'trips'>): Effect.Effect<void, UnexpectedError>;
  toggleFavoriteTrip(params: { id: Id<'trips'>; isFavorite: boolean }): Effect.Effect<void, UnexpectedError>;
  updateActivityPhotos(params: {
    id: Id<'trips'>;
    placeNumberID: number;
    photoResourceNames: readonly string[];
  }): Effect.Effect<void, UnexpectedError>;
  updateDishImage(params: {
    id: Id<'trips'>;
    searchTerm: string;
    imageUrl: string;
  }): Effect.Effect<void, UnexpectedError>;
  updateCoverImage(params: { id: Id<'trips'>; coverImage: CoverImage }): Effect.Effect<void, UnexpectedError>;
}
