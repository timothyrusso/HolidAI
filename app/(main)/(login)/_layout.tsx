import CustomHeader from '@/ui/components/composite/CustomHeader/CustomHeader';
import { Routes } from '@/ui/constants/navigation/routes';
import { icons } from '@/ui/constants/style/icons';
import { Stack, useRouter } from 'expo-router';

export default function LoginLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen name={Routes.Welcome} options={{ headerShown: false }} />
      <Stack.Screen
        name={Routes.SignIn}
        options={{
          header: () => <CustomHeader title="SIGNIN.TITLE" icon={icons.close} onPress={() => router.back()} />,
        }}
      />
      <Stack.Screen
        name={Routes.SignUp}
        options={{
          header: () => <CustomHeader title="SIGNUP.TITLE" icon={icons.close} onPress={() => router.back()} />,
        }}
      />
    </Stack>
  );
}
