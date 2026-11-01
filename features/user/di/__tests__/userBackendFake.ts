import { api } from '@/convex/_generated/api';
import { A_CLERK_USER, convexFake } from '@/features/core/testing';

/**
 * The users table of a Convex deployment, in memory: the QA user with `tokens` generation tokens.
 * Install it inside the test (the Convex fake resets before each one); `tokens()` is what is left.
 */
export const UserBackendFake = (tokens = 10, clerkId = A_CLERK_USER.id) => {
  const balances = new Map([[clerkId, tokens]]);

  convexFake.setQuery(api.users.getUserTokens, args => balances.get(args.clerkId) ?? null);
  convexFake.setMutation(api.users.decrementUserTokens, args => {
    const left = (balances.get(args.clerkId) ?? 0) - args.amount;
    if (left < 0) throw new Error('Insufficient tokens');
    balances.set(args.clerkId, left);
  });

  return { tokens: () => balances.get(clerkId) };
};
