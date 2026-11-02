import { useUser } from '@clerk/expo';
import { useMutation, useQuery } from 'convex/react';
import { Effect } from 'effect';
import { api } from '@/convex/_generated/api';
import { toAppError } from '@/features/core/error';
import type { ITripRepository } from '@/features/trips/domain/entities/repositories/ITripRepository';

export const useTripRepository = (): ITripRepository => {
  const { user } = useUser();
  const userId = user?.id;

  const userTrips = useQuery(api.trips.getAllTripsbyUserId, userId ? { userId } : 'skip');
  const createTrip = useMutation(api.trips.createTrip);
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

  const run = <A>(mutate: () => Promise<A>) =>
    Effect.tryPromise({ try: () => mutate(), catch: cause => toAppError(cause) });

  return {
    getTrips: () => userTrips,
    addTrip: params => run(() => createTrip(params)),
    deleteTrip: id => run(() => deleteTripMutation({ id })),
    toggleFavoriteTrip: params => run(() => toggleFavoriteTripMutation(params)),
    updateActivityPhotos: params =>
      run(() => updateActivityPhotosMutation({ ...params, photoResourceNames: [...params.photoResourceNames] })),
    updateDishImage: params => run(() => updateDishImageMutation(params)),
    updateCoverImage: params => run(() => updateCoverImageMutation(params)),
  };
};
