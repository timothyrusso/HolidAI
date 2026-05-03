import { ensureError, fail, ok } from '@/features/core/error';
import { UserError } from '@/features/user/domain/entities/errors/UserError';
import type { IUserRepository } from '@/features/user/domain/entities/repositories/IUserRepository';
import { useClerk, useUser } from '@clerk/clerk-expo';

export const useUserRepository = (): IUserRepository => {
  const { signOut } = useClerk();
  const { user } = useUser();

  return {
    getUser: () =>
      user
        ? {
            id: user.id,
            firstName: user.firstName,
            email: user.primaryEmailAddress?.emailAddress,
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
      if (!user) return fail(new UserError('No user to delete'));
      try {
        await user.delete();
        return ok(undefined);
      } catch (err) {
        return fail(ensureError(err));
      }
    },
  };
};
