import { Routes, navigationService } from '@/features/core/navigation';
import { CustomHeader, icons } from '@/features/core/ui';
import { Stack } from 'expo-router';

export default function HomePageLayout() {
  return (
    <Stack>
      <Stack.Screen
        name={Routes.ShowAllTrips}
        options={{
          header: () => (
            <CustomHeader
              title="SHOW_ALL_TRIPS.TITLE"
              icon={icons.arrowBack}
              onPress={() => navigationService.back()}
            />
          ),
        }}
      />
    </Stack>
  );
}
