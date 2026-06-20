import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { CoverImage, TripAiResp } from './validators/Trips';

export const getAllTripsbyUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const trips = await ctx.db.query('trips').collect();

    return trips.filter(trip => trip.userId === args.userId);
  },
});

export const createTrip = mutation({
  args: {
    userId: v.string(),
    tripAiResp: TripAiResp,
    isFavorite: v.boolean(),
  },
  returns: v.id('trips'),
  handler: async (ctx, args) => {
    const tripId = await ctx.db.insert('trips', {
      userId: args.userId,
      tripAiResp: args.tripAiResp,
      isFavorite: args.isFavorite,
    });
    return tripId;
  },
});

export const deleteTrip = mutation({
  args: { id: v.id('trips') },
  handler: async (ctx, args) => {
    await ctx.db.delete('trips', args.id);
    return;
  },
});

export const toggleFavoriteTrip = mutation({
  args: { id: v.id('trips'), isFavorite: v.boolean() },
  handler: async (ctx, args) => {
    const trip = await ctx.db.get('trips', args.id);
    if (!trip) {
      throw new Error('Trip not found');
    }
    await ctx.db.replace(args.id, {
      ...trip,
      isFavorite: args.isFavorite,
    });
    return;
  },
});

export const updateActivityPhotos = mutation({
  args: { id: v.id('trips'), placeNumberID: v.number(), photoResourceNames: v.array(v.string()) },
  handler: async (ctx, args) => {
    const trip = await ctx.db.get('trips', args.id);
    if (!trip) throw new Error('Trip not found');
    await ctx.db.replace('trips', args.id, {
      ...trip,
      tripAiResp: {
        ...trip.tripAiResp,
        dayPlans: trip.tripAiResp.dayPlans.map(dayPlan => ({
          ...dayPlan,
          schedule: dayPlan.schedule.map(item =>
            item.placeNumberID === args.placeNumberID ? { ...item, photoResourceNames: args.photoResourceNames } : item,
          ),
        })),
      },
    });
  },
});

export const updateDishImage = mutation({
  args: { id: v.id('trips'), searchTerm: v.string(), imageUrl: v.string() },
  handler: async (ctx, args) => {
    const trip = await ctx.db.get('trips', args.id);
    if (!trip) throw new Error('Trip not found');
    await ctx.db.replace('trips', args.id, {
      ...trip,
      tripAiResp: {
        ...trip.tripAiResp,
        food: {
          ...trip.tripAiResp.food,
          typicalDishes: trip.tripAiResp.food.typicalDishes.map(dish =>
            dish.searchTerm === args.searchTerm ? { ...dish, imageUrl: args.imageUrl } : dish,
          ),
        },
      },
    });
  },
});

export const updateCoverImage = mutation({
  args: { id: v.id('trips'), coverImage: CoverImage },
  handler: async (ctx, args) => {
    const trip = await ctx.db.get('trips', args.id);
    if (!trip) throw new Error('Trip not found');
    await ctx.db.replace('trips', args.id, {
      ...trip,
      tripAiResp: { ...trip.tripAiResp, coverImage: args.coverImage },
    });
  },
});

export const deleteAllTripsByUserId = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const trips = await ctx.db.query('trips').collect();

    const userTrips = trips.filter(trip => trip.userId === args.userId);

    for (const trip of userTrips) {
      await ctx.db.delete('trips', trip._id);
    }

    return;
  },
});
