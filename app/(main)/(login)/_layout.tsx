import { Routes } from '@/features/core/navigation';
import { CustomHeader } from '@/ui/components/composite/CustomHeader/CustomHeader';
import { Stack } from 'expo-router';

export default function LoginLayout() {
  return (
    <Stack>
      <Stack.Screen name={Routes.Welcome} options={{ headerShown: false }} />
      <Stack.Screen
        name={Routes.SignIn}
        options={{
          header: () => <CustomHeader title="SIGNIN.TITLE" />,
        }}
      />
      <Stack.Screen
        name={Routes.SignUp}
        options={{
          header: () => <CustomHeader title="SIGNUP.TITLE" />,
        }}
      />
    </Stack>
  );
}
