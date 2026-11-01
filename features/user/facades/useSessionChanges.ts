import { useAuth } from '@clerk/expo';
import { useEffect, useRef } from 'react';
import { navigationService } from '@/features/core/navigation';
import { resetAllStores } from '@/features/core/state';

/**
 * Follows the Clerk session: a sign-in goes home, and a sign-out (from anywhere, Clerk's own
 * account screen included) resets every client store, so the next user starts clean. Returns
 * whether someone is signed in, for the route guards.
 */
export const useSessionChanges = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const wasSignedIn = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    if (!isLoaded) return;
    const before = wasSignedIn.current;
    wasSignedIn.current = isSignedIn;
    if (before === false && isSignedIn) navigationService.toHome();
    if (before === true && !isSignedIn) resetAllStores();
  }, [isLoaded, isSignedIn]);

  return { isSignedIn: !!isSignedIn };
};
