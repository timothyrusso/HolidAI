import { useAuth } from '@clerk/expo';
import { useEffect, useRef } from 'react';
import { navigationService } from '@/features/core/navigation';
import { resetAllStores } from '@/features/core/state';

/**
 * Follows the Clerk session: a sign-in goes home, and a sign-out or an account switch (from
 * anywhere, Clerk's own account screen included) resets every client store, so the next user
 * starts clean. Returns whether someone is signed in, for the route guards.
 */
export const useSessionChanges = () => {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const previousUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (!isLoaded) return;
    const before = previousUserId.current;
    const current = userId ?? null;
    previousUserId.current = current;
    if (before === null && current !== null) navigationService.toHome();
    if (before && before !== current) resetAllStores();
  }, [isLoaded, userId]);

  return { isSignedIn: !!isSignedIn };
};
