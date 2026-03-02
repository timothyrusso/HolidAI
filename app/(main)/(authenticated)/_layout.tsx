import { screenOptions } from '@/modules/navigation/domain/entities/ScreenOptions';
import { Routes, Stacks } from '@/modules/navigation/domain/entities/routes';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) return <Redirect href={`/${Routes.Welcome}`} />;

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name={Stacks.Tabs} />
      <Stack.Screen name={Stacks.CreateTrip} />
      <Stack.Screen name={Stacks.HomePage} />
    </Stack>
  );
}
