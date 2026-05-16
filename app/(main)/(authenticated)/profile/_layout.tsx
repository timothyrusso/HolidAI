import { Routes, navigationService } from '@/features/core/navigation';
import { CustomHeader, icons } from '@/features/core/ui';
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
