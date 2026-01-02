import { logger } from '@/di/resolve';
import { httpRouter } from 'convex/server';
import { internal } from './_generated/api';
import { httpAction } from './_generated/server';

const http = httpRouter();

export const handleClerkWebHook = httpAction(async (ctx, request) => {
  const { data, type } = await request.json();

  switch (type) {
    case 'user.created':
      await ctx.runMutation(internal.users.createUser, { clerkId: data.id });
      break;
    case 'user.deleted':
      await ctx.runMutation(internal.users.deleteFromClerk, { clerkId: data.id });
      break;
    default:
      logger.error(new Error('Unhandled event type:'), type);
  }

  return new Response(null, { status: 200 });
});

http.route({
  path: '/clerk-users-webhook',
  method: 'POST',
  handler: handleClerkWebHook,
});

export default http;
