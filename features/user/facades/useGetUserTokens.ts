import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';

export const useGetUserTokens = () => {
  const { user } = useUser();
  const tokens = useQuery(api.users.getUserTokens, { clerkId: user?.id ?? '' });

  return { userTokens: tokens ?? 0 };
};
