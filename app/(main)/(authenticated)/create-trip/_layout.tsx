import { Routes } from '@/modules/navigation/domain/entities/routes';
import CustomHeader from '@/ui/components/composite/CustomHeader/CustomHeader';
import { icons } from '@/ui/style/icons';
import { Stack, useRouter } from 'expo-router';

export default function CreateTripLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name={Routes.GenerateTrip}
        options={{
          header: () => <CustomHeader title="GENERATE_TRIP.TITLE" />,
        }}
      />
      <Stack.Screen
        name={Routes.Search}
        options={{
          header: () => (
            <CustomHeader title="SEARCH_PLACE_PAGE.TITLE" icon={icons.arrowBack} onPress={() => router.back()} />
          ),
        }}
      />
      <Stack.Screen
        name={Routes.ReviewTrip}
        options={{
          header: () => <CustomHeader title="REVIEW_TRIP.TITLE" icon={icons.arrowBack} onPress={() => router.back()} />,
        }}
      />
      <Stack.Screen
        name={Routes.SelectBudget}
        options={{
          header: () => (
            <CustomHeader title="SELECT_BUDGET.TITLE" icon={icons.arrowBack} onPress={() => router.back()} />
          ),
        }}
      />
      <Stack.Screen
        name={Routes.SelectDates}
        options={{
          header: () => (
            <CustomHeader title="SELECT_DATES.TITLE" icon={icons.arrowBack} onPress={() => router.back()} />
          ),
        }}
      />
      <Stack.Screen
        name={Routes.SelectTraveler}
        options={{
          header: () => (
            <CustomHeader title="SELECT_TRAVELERS.TITLE" icon={icons.arrowBack} onPress={() => router.back()} />
          ),
        }}
      />
      <Stack.Screen
        name={Routes.TripDetails}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={Routes.ActivityDetails}
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
