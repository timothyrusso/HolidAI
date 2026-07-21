import { useUser } from '@clerk/expo';
import { useConvex, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ensureError, fail, ok } from '@/features/core/error';
import type { ITripRepository } from '@/features/trips/domain/entities/repositories/ITripRepository';

export const useTripRepository = (): ITripRepository => {
  const { user } = useUser();
  const userId = user?.id;

  const convex = useConvex();

  const userTrips = useQuery(api.trips.getAllTripsbyUserId, userId ? { userId } : 'skip');
  const createTrip = useMutation(api.trips.createTrip);
  const deleteAllTripsMutation = useMutation(api.trips.deleteAllTripsByUserId);
  const deleteTripMutation = useMutation(api.trips.deleteTrip);

  const updateActivityPhotosMutation = useMutation(api.trips.updateActivityPhotos).withOptimisticUpdate(
    (localStore, args) => {
      if (!userId) return;
      const trips = localStore.getQuery(api.trips.getAllTripsbyUserId, { userId });
      if (trips) {
        localStore.setQuery(
          api.trips.getAllTripsbyUserId,
          { userId },
          trips.map(t =>
            t._id === args.id
              ? {
                  ...t,
                  tripAiResp: {
                    ...t.tripAiResp,
                    dayPlans: t.tripAiResp.dayPlans.map(dayPlan => ({
                      ...dayPlan,
                      schedule: dayPlan.schedule.map(item =>
                        item.placeNumberID === args.placeNumberID
                          ? { ...item, photoResourceNames: args.photoResourceNames }
                          : item,
                      ),
                    })),
                  },
                }
              : t,
          ),
        );
      }
    },
  );

  const updateDishImageMutation = useMutation(api.trips.updateDishImage).withOptimisticUpdate((localStore, args) => {
    if (!userId) return;
    const trips = localStore.getQuery(api.trips.getAllTripsbyUserId, { userId });
    if (trips) {
      localStore.setQuery(
        api.trips.getAllTripsbyUserId,
        { userId },
        trips.map(t =>
          t._id === args.id
            ? {
                ...t,
                tripAiResp: {
                  ...t.tripAiResp,
                  food: {
                    ...t.tripAiResp.food,
                    typicalDishes: t.tripAiResp.food.typicalDishes.map(dish =>
                      dish.searchTerm === args.searchTerm ? { ...dish, imageUrl: args.imageUrl } : dish,
                    ),
                  },
                },
              }
            : t,
        ),
      );
    }
  });

  const updateCoverImageMutation = useMutation(api.trips.updateCoverImage).withOptimisticUpdate((localStore, args) => {
    if (!userId) return;
    const trips = localStore.getQuery(api.trips.getAllTripsbyUserId, { userId });
    if (trips) {
      localStore.setQuery(
        api.trips.getAllTripsbyUserId,
        { userId },
        trips.map(t =>
          t._id === args.id ? { ...t, tripAiResp: { ...t.tripAiResp, coverImage: args.coverImage } } : t,
        ),
      );
    }
  });

  const toggleFavoriteTripMutation = useMutation(api.trips.toggleFavoriteTrip).withOptimisticUpdate(
    (localStore, args) => {
      if (!userId) return;
      const trips = localStore.getQuery(api.trips.getAllTripsbyUserId, { userId });
      if (trips) {
        localStore.setQuery(
          api.trips.getAllTripsbyUserId,
          { userId },
          trips.map(t => (t._id === args.id ? { ...t, isFavorite: args.isFavorite } : t)),
        );
      }
    },
  );

  return {
    getTrips: () => userTrips,

    refetchTrips: async () => {
      if (!userId) return ok(undefined);
      try {
        await convex.query(api.trips.getAllTripsbyUserId, { userId });
        return ok(undefined);
      } catch (err) {
        return fail(ensureError(err));
      }
    },

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

    deleteTrip: async id => {
      try {
        await deleteTripMutation({ id });
        return ok(undefined);
      } catch (err) {
        return fail(ensureError(err));
      }
    },

    toggleFavoriteTrip: async params => {
      try {
        await toggleFavoriteTripMutation(params);
        return ok(undefined);
      } catch (err) {
        return fail(ensureError(err));
      }
    },

    updateActivityPhotos: async params => {
      try {
        await updateActivityPhotosMutation(params);
        return ok(undefined);
      } catch (err) {
        return fail(ensureError(err));
      }
    },

    updateDishImage: async params => {
      try {
        await updateDishImageMutation(params);
        return ok(undefined);
      } catch (err) {
        return fail(ensureError(err));
      }
    },

    updateCoverImage: async params => {
      try {
        await updateCoverImageMutation(params);
        return ok(undefined);
      } catch (err) {
        return fail(ensureError(err));
      }
    },
  };
};
