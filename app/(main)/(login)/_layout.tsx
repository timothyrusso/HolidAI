import { Routes } from '@/modules/navigation/domain/entities/routes';
import CustomHeader from '@/ui/components/composite/CustomHeader/CustomHeader';
import { icons } from '@/ui/style/icons';
import { Stack, useRouter } from 'expo-router';

export default function LoginLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen name={Routes.Welcome} options={{ headerShown: false }} />
      <Stack.Screen
        name={Routes.SignIn}
        options={{
          header: () => (
            <CustomHeader
              title="SIGNIN.TITLE"
              icon={icons.arrowBack}
              onPress={() => router.replace(`/${Routes.Welcome}`)}
            />
          ),
        }}
      />
      <Stack.Screen
        name={Routes.SignUp}
        options={{
          header: () => (
            <CustomHeader
              title="SIGNUP.TITLE"
              icon={icons.arrowBack}
              onPress={() => router.replace(`/${Routes.SignIn}`)}
            />
          ),
        }}
      />
    </Stack>
  );
}
