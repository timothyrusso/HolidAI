import { v } from 'convex/values';

export const User = {
  email: v.string(),
  clerkId: v.string(),
  first_name: v.optional(v.string()),
  last_name: v.optional(v.string()),
  username: v.union(v.string(), v.null()),
  pushToken: v.optional(v.string()),
};
