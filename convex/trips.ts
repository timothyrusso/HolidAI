import { query } from './_generated/server';

export const getAllTrips = query({
  args: {},
  handler: async ctx => {
    return await ctx.db.query('trips').collect();
  },
});
