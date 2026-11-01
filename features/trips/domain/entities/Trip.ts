// NOTE: pragmatic exception to domain purity: `Id<'trips'>` is a Convex branded string type used
// throughout the Convex query/mutation API. Replacing it with a plain string would need an adapter
// layer at every data boundary, for minimal architectural gain: it carries no runtime behaviour.
import type { Id } from '@/convex/_generated/dataModel';
import type { GeneratedTrip } from '@/features/ai';

/** The generated part of a saved trip: the trip `GeneratedTripSchema` decodes, once enriched. */
export type TripAiResp = GeneratedTrip;

export interface Trip {
  _id: Id<'trips'>;
  tripAiResp: TripAiResp;
  isFavorite: boolean;
  _creationTime: number;
}
