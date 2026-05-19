import { Routes } from '@/features/core/navigation';
import { CustomHeader } from '@/features/core/ui';
import { Stack } from 'expo-router';

export default function LoginLayout() {
  return (
    <Stack>
      <Stack.Screen name={Routes.Welcome} options={{ headerShown: false }} />
      <Stack.Screen
        name={Routes.SignInOrSignUp}
        options={{
          header: () => <CustomHeader title="SIGNIN.TITLE" />,
        }}
      />
    </Stack>
  );
}
