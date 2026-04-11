import { api } from '@/convex/_generated/api';
import { ensureError, fail, ok } from '@/features/core/error';
import type { ITripRepository } from '@/features/trips/domain/entities/repositories/ITripRepository';
import { useUser } from '@clerk/clerk-expo';
import { useMutation, useQuery } from 'convex/react';

export const useTripRepository = (): ITripRepository => {
  const { user } = useUser();
  const userId = user?.id ?? '';

  const userTrips = useQuery(api.trips.getAllTripsbyUserId, { userId });
  const createTrip = useMutation(api.trips.createTrip);
  const deleteAllTripsMutation = useMutation(api.trips.deleteAllTripsByUserId);

  return {
    getTrips: () => userTrips,

    addTrip: async params => {
      try {
        const id = await createTrip(params);
        return ok(id);
      } catch (err) {
        return fail(ensureError(err));
      }
    },

    deleteAllTrips: async id => {
      try {
        await deleteAllTripsMutation({ userId: id });
        return ok(undefined);
      } catch (err) {
        return fail(ensureError(err));
      }
    },
  };
};
