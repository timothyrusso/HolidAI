import { type ErrorBoundaryProps, Stack } from 'expo-router';
import { GenericCrashView } from '@/features/core/error/pages';
import { Routes, Stacks, screenOptions } from '@/features/core/navigation';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <GenericCrashView error={error} retry={retry} redirectTo={`/${Routes.HomePage}`} />;
}

export default function AuthLayout() {
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name={Stacks.Tabs} />
      <Stack.Screen name={Stacks.CreateTrip} />
      <Stack.Screen name={Stacks.HomePage} />
    </Stack>
  );
}
