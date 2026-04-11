import { ensureError, fail, ok } from '@/features/core/error';
import { ProfileError } from '@/features/profile/domain/entities/errors/ProfileError';
import type { IProfileRepository } from '@/features/profile/domain/entities/repositories/IProfileRepository';
import { useClerk, useUser } from '@clerk/clerk-expo';

export const useProfileRepository = (): IProfileRepository => {
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
      if (!user) return fail(new ProfileError('No user to delete'));
      try {
        await user.delete();
        return ok(undefined);
      } catch (err) {
        return fail(ensureError(err));
      }
    },
  };
};
