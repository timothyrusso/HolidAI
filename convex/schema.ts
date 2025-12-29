import { defineSchema, defineTable } from 'convex/server';
import { Trips } from './validators/Trips';

export default defineSchema({
  trips: defineTable(Trips),
});
