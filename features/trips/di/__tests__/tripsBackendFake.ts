import { api } from '@/convex/_generated/api';
import { A_CLERK_USER, convexFake } from '@/features/core/testing';
import type { Trip } from '@/features/trips/domain/entities/Trip';

type TripRow = { readonly userId: string; trip: Trip };

/**
 * The trips table of a Convex deployment, in memory, seeded with `trips` for the QA user. Install
 * it inside the test (the Convex fake resets before each one); `trips()` is what the table holds.
 */
export const TripsBackendFake = (trips: readonly Trip[] = [], userId = A_CLERK_USER.id) => {
  let rows: TripRow[] = trips.map(trip => ({ userId, trip }));

  const update = (id: string, change: (trip: Trip) => Trip) => {
    rows = rows.map(row => (row.trip._id === id ? { ...row, trip: change(row.trip) } : row));
  };
  const updateAiResp = (id: string, change: (tripAiResp: Trip['tripAiResp']) => Trip['tripAiResp']) =>
    update(id, trip => ({ ...trip, tripAiResp: change(trip.tripAiResp) }));

  convexFake.setQuery(api.trips.getAllTripsbyUserId, args =>
    rows.filter(row => row.userId === args.userId).map(row => row.trip),
  );
  convexFake.setMutation(api.trips.createTrip, args => {
    const trip = {
      _id: `trip_${rows.length + 1}`,
      _creationTime: 1_700_000_000_000 + rows.length,
      tripAiResp: args.tripAiResp,
      isFavorite: args.isFavorite,
    } as Trip;
    rows = [...rows, { userId: args.userId, trip }];
    return trip._id;
  });
  convexFake.setMutation(api.trips.deleteTrip, args => {
    rows = rows.filter(row => row.trip._id !== args.id);
  });
  convexFake.setMutation(api.trips.toggleFavoriteTrip, args =>
    update(args.id, trip => ({ ...trip, isFavorite: args.isFavorite })),
  );
  convexFake.setMutation(api.trips.updateCoverImage, args =>
    updateAiResp(args.id, tripAiResp => ({ ...tripAiResp, coverImage: args.coverImage })),
  );
  convexFake.setMutation(api.trips.updateDishImage, args =>
    updateAiResp(args.id, tripAiResp => ({
      ...tripAiResp,
      food: {
        ...tripAiResp.food,
        typicalDishes: tripAiResp.food.typicalDishes.map(dish =>
          dish.searchTerm === args.searchTerm ? { ...dish, imageUrl: args.imageUrl } : dish,
        ),
      },
    })),
  );
  convexFake.setMutation(api.trips.updateActivityPhotos, args =>
    updateAiResp(args.id, tripAiResp => ({
      ...tripAiResp,
      dayPlans: tripAiResp.dayPlans.map(dayPlan => ({
        ...dayPlan,
        schedule: dayPlan.schedule.map(item =>
          item.placeNumberID === args.placeNumberID ? { ...item, photoResourceNames: args.photoResourceNames } : item,
        ),
      })),
    })),
  );

  return { trips: () => rows.map(row => row.trip) };
};
