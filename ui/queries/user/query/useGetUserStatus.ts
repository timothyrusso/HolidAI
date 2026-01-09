import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/clerk-expo';
import { useMutation, useQuery } from 'convex/react';

export const useGetUserStatus = () => {
  const { user } = useUser();
  const userId = user?.id;

  const userTokens = useQuery(api.users.getUserTokens, { clerkId: userId ?? '' });
  const decrementUserTokens = useMutation(api.users.decrementUserTokens);

  const getUserTokens = () => {
    return userTokens ?? 0;
  };

  const decrementTokens = (amount: number) => {
    if (userId) {
      decrementUserTokens({ clerkId: userId, amount });
    }
  };

  return {
    getUserTokens,
    decrementTokens,
  };
};
