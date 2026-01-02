import { logger } from '@/di/resolve';
import { dbKeys } from '@/modules/trip/domain/entities/DbKeys';
import { v } from 'convex/values';
import { type QueryCtx, internalMutation, query } from './_generated/server';

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query(dbKeys.users)
    .filter(q => q.eq(q.field('clerkId'), externalId))
    .unique();
}

export const createUser = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert(dbKeys.users, {
      ...args,
      tokens: 5,
      isPro: false,
    });

    return userId;
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkId: v.string() },
  async handler(ctx, { clerkId }) {
    const user = await userByExternalId(ctx, clerkId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      logger.error(new Error(`Can't delete user, there is none for Clerk user ID: ${clerkId}`));
    }
  },
});

export const getUserTokens = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await userByExternalId(ctx, args.clerkId);

    if (!user) {
      throw new Error('User not found');
    }

    return user.tokens;
  },
});
