import { BaseError, ErrorCode, ensureError, fail, ok } from '@/features/core/error';
import type { IUserRepository } from '@/features/user/domain/entities/repositories/IUserRepository';
import { useClerk, useUser } from '@clerk/expo';

export const useUserRepository = (): IUserRepository => {
  const { signOut } = useClerk();
  const { user } = useUser();

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

    signOut: async () => {
      try {
        await signOut();
        return ok(undefined);
      } catch (err) {
        return fail(ensureError(err));
      }
    },

    deleteUser: async () => {
      if (!user) return fail(new BaseError('No user to delete', ErrorCode.NotFound));
      try {
        await user.delete();
        return ok(undefined);
      } catch (err) {
        return fail(ensureError(err));
      }
    },
  };
};
