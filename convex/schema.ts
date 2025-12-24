import { defineSchema, defineTable } from 'convex/server';
import { Trips } from './validators/Trips';
import { User } from './validators/User';

export default defineSchema({
  users: defineTable(User),
  trips: defineTable(Trips).index('by_user', ['userId']), // Index for efficient queries by user
});
