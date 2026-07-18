import { useAuth } from '@clerk/expo';
import { Stack } from 'expo-router';
import { Stacks } from '@/features/core/navigation';

export default function AppLayout() {
  const { isSignedIn } = useAuth();

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
