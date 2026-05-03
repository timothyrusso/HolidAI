import { Routes, navigationService } from '@/features/core/navigation';
import { CustomHeader } from '@/ui/components/composite/CustomHeader/CustomHeader';
import { icons } from '@/ui/style/icons';
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name={Routes.ChangeLanguage}
        options={{
          header: () => (
            <CustomHeader
              title="PROFILE.BUTTON.CHANGE_LANGUAGE"
              icon={icons.arrowBack}
              onPress={() => navigationService.back()}
            />
          ),
        }}
      />
    </Stack>
  );
}
