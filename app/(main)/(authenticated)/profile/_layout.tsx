import CustomHeader from '@/ui/components/composite/CustomHeader/CustomHeader';
import { Routes } from '@/ui/constants/navigation/routes';
import { icons } from '@/ui/constants/style/icons';
import { Stack, useRouter } from 'expo-router';

export default function ProfileLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name={Routes.ChangeLanguage}
        options={{
          header: () => (
            <CustomHeader title="PROFILE.BUTTON.CHANGE_LANGUAGE" icon={icons.arrowBack} onPress={() => router.back()} />
          ),
        }}
      />
    </Stack>
  );
}
