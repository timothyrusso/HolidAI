import { Stack } from 'expo-router';
import { Routes } from '@/features/core/navigation';

export default function LoginLayout() {
  return (
    <Stack>
      <Stack.Screen name={Routes.Welcome} options={{ headerShown: false }} />
      <Stack.Screen name={Routes.SignInOrSignUp} options={{ headerShown: false }} />
    </Stack>
  );
}
