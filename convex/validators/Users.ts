import { v } from 'convex/values';

export const Users = v.object({
  clerkId: v.string(),
  tokens: v.number(),
  isPro: v.boolean(),
});
