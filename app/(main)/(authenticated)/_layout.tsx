import { screenOptions } from '@/ui/constants/navigation/ScreenOptions';
import { Routes, Stacks } from '@/ui/constants/navigation/routes';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) return <Redirect href={`/${Routes.Welcome}`} />;

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name={Stacks.Tabs} />
      <Stack.Screen name={Stacks.CreateTrip} />
      <Stack.Screen name={Stacks.MyTrips} />
    </Stack>
  );
}
