import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.monthly(
  'reset all user tokens',
  { day: 1, hourUTC: 0, minuteUTC: 0 }, // Every month on the first day at midnight UTC.
  internal.users.resetAllUserTokens,
);

export default crons;
