import { Effect } from 'effect';
import type { GeneratedTrip } from '@/features/ai';
import { enrichTrip } from '@/features/trip-generation/useCases/enrichTrip';

/**
 * Saves a generated trip with its pictures through `save` (the trips repository's `addTrip`), and
 * returns what `save` returns, the new trip's id.
 */
export const saveTrip = <A, E>(trip: GeneratedTrip, save: (trip: GeneratedTrip) => Effect.Effect<A, E>) =>
  Effect.flatMap(enrichTrip(trip), save);
