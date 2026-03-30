import { Routes, navigationService } from '@/features/core/navigation';
import CustomHeader from '@/ui/components/composite/CustomHeader/CustomHeader';
import { icons } from '@/ui/style/icons';
import { Stack } from 'expo-router';

export default function LoginLayout() {
  return (
    <Stack>
      <Stack.Screen name={Routes.Welcome} options={{ headerShown: false }} />
      <Stack.Screen
        name={Routes.SignIn}
        options={{
          header: () => (
            <CustomHeader title="SIGNIN.TITLE" icon={icons.arrowBack} onPress={() => navigationService.toWelcome()} />
          ),
        }}
      />
      <Stack.Screen
        name={Routes.SignUp}
        options={{
          header: () => (
            <CustomHeader title="SIGNUP.TITLE" icon={icons.arrowBack} onPress={() => navigationService.toSignIn()} />
          ),
        }}
      />
    </Stack>
  );
}
