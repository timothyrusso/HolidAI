import { Routes } from '@/modules/navigation/domain/entities/routes';
import CustomHeader from '@/ui/components/composite/CustomHeader/CustomHeader';
import { icons } from '@/ui/style/icons';
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
