import { defineSchema, defineTable } from 'convex/server';
import { Trips } from './validators/Trips';
import { Users } from './validators/Users';

export default defineSchema({
  trips: defineTable(Trips),
  users: defineTable(Users),
});
