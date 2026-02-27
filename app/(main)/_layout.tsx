import { Stacks } from '@/modules/navigation/domain/entities/routes';
import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Stacks.Login} />
      <Stack.Screen name={Stacks.Authenticated} />
    </Stack>
  );
}
