import { v } from 'convex/values';
import { dbKeys } from '../modules/trip/domain/entities/DbKeys';
import { type QueryCtx, internalMutation, mutation, query } from './_generated/server';

const DEFAULT_TOKENS = 10;

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
      // biome-ignore lint/suspicious/noConsole: <No logger available here>
      console.error(new Error(`Can't delete user, there is none for Clerk user ID: ${clerkId}`));
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

export const decrementUserTokens = mutation({
  args: { clerkId: v.string(), amount: v.number() },
  handler: async (ctx, args) => {
    const user = await userByExternalId(ctx, args.clerkId);

    if (!user) {
      throw new Error('User not found');
    }

    const newTokens = user.tokens - args.amount;

    if (newTokens < 0) {
      throw new Error('Insufficient tokens');
    }

    await ctx.db.patch(user._id, { tokens: newTokens });

    return newTokens;
  },
});

export const resetAllUserTokens = internalMutation({
  args: {},
  handler: async ctx => {
    const users = await ctx.db.query(dbKeys.users).collect();
    for (const user of users) {
      await ctx.db.patch(user._id, { tokens: DEFAULT_TOKENS });
    }
  },
});
