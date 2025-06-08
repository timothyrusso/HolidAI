import CustomHeader from '@/ui/components/composite/CustomHeader/CustomHeader';
import { Routes } from '@/ui/constants/navigation/routes';
import { icons } from '@/ui/constants/style/icons';
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
