import { Routes, Stacks, screenOptions } from '@/features/core/navigation';
import { GenericCrashView } from '@/ui/components/errors/GenericCrashView/GenericCrashView';
import { useAuth } from '@clerk/clerk-expo';
import { type ErrorBoundaryProps, Redirect, Stack } from 'expo-router';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <GenericCrashView error={error} retry={retry} redirectTo={`/${Routes.HomePage}`} />;
}

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
