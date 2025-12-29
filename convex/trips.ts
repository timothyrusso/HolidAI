import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { TripAiResp } from './validators/Trips';

export const getAllTripsbyUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const trips = await ctx.db.query('trips').collect();

    return trips.filter(trip => trip.userId === args.userId);
  },
});

export const createTrip = mutation({
  args: {
    tripId: v.string(),
    userId: v.string(),
    tripAiResp: TripAiResp,
    isFavorite: v.boolean(),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    const tripId = await ctx.db.insert('trips', {
      tripId: args.tripId,
      userId: args.userId,
      tripAiResp: args.tripAiResp,
      isFavorite: args.isFavorite,
      createdAt: args.createdAt,
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
