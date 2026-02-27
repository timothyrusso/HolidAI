import { Routes } from '@/modules/navigation/domain/entities/routes';
import CustomHeader from '@/ui/components/composite/CustomHeader/CustomHeader';
import { icons } from '@/ui/style/icons';
import { Stack, useRouter } from 'expo-router';

export default function MyTripLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name={Routes.ShowAllTrips}
        options={{
          header: () => (
            <CustomHeader title="SHOW_ALL_TRIPS.TITLE" icon={icons.arrowBack} onPress={() => router.back()} />
          ),
        }}
      />
    </Stack>
  );
}
