import { Effect } from 'effect';
import type { GeneratedTrip } from '@/features/ai';
import { Unauthorized } from '@/features/core/error';
import { enrichTrip } from '@/features/trip-generation/useCases/enrichTrip';

/**
 * Saves a generated trip with its pictures for `userId` through `save` (the trips repository's
 * `addTrip`), and returns what `save` returns, the new trip's id. Fails with `Unauthorized`,
 * before fetching any picture, when nobody is signed in.
 */
export const saveTrip = <A, E>(
  trip: GeneratedTrip,
  userId: string | undefined,
  save: (trip: GeneratedTrip, userId: string) => Effect.Effect<A, E>,
) =>
  Effect.gen(function* () {
    if (!userId) return yield* new Unauthorized();
    const enriched = yield* enrichTrip(trip);
    return yield* save(enriched, userId);
  });
