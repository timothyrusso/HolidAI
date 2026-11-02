import { useUser } from '@clerk/expo';
import { useMutation } from 'convex/react';
import { Effect } from 'effect';
import { api } from '@/convex/_generated/api';
import { toAppError } from '@/features/core/error';
import type { IUserRepository } from '@/features/user/domain/entities/repositories/IUserRepository';

export const useUserRepository = (): IUserRepository => {
  const { user } = useUser();
  const decrementUserTokens = useMutation(api.users.decrementUserTokens);

  return {
    getUser: () =>
      user
        ? {
            id: user.id,
            username: user.username,
            email: user.primaryEmailAddress?.emailAddress,
            profileImageUrl: user.imageUrl,
          }
        : undefined,

    decrementTokens: amount => {
      const clerkId = user?.id;
      if (!clerkId) return Effect.void;
      return Effect.tryPromise({
        try: () => decrementUserTokens({ clerkId, amount }),
        catch: cause => toAppError(cause),
      });
    },
  };
};
