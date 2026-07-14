import { Stack } from 'expo-router';
import { Stacks } from '@/features/core/navigation';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Stacks.NotAuthenticated} />
      <Stack.Screen name={Stacks.Authenticated} />
    </Stack>
  );
}
