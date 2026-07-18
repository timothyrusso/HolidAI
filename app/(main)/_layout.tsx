import { useAuth } from '@clerk/expo';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Routes, Stacks } from '@/features/core/navigation';

export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const prevSignedIn = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    if (!isLoaded) return;
    // useRef holds the previous auth state so we redirect only on a genuine
    // signed-out -> signed-in transition, not on cold-start auth resolution.
    const wasSignedIn = prevSignedIn.current;
    prevSignedIn.current = isSignedIn;
    if (wasSignedIn === false && isSignedIn) {
      router.replace(`/${Routes.HomePage}`);
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!isSignedIn}>
        <Stack.Screen name={Stacks.Authenticated} />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name={Stacks.NotAuthenticated} />
      </Stack.Protected>
    </Stack>
  );
}
