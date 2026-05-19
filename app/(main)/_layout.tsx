import { Stacks } from '@/features/core/navigation';
import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Stacks.NotAuthenticated} />
      <Stack.Screen name={Stacks.Authenticated} />
    </Stack>
  );
}
