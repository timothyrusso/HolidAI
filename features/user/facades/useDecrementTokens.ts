import { useUser } from '@clerk/expo';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export const useDecrementTokens = () => {
  const { user } = useUser();
  const decrementUserTokens = useMutation(api.users.decrementUserTokens);

  const decrementTokens = (amount: number) => {
    if (user?.id) {
      decrementUserTokens({ clerkId: user.id, amount });
    }
  };

  return { decrementTokens };
};
