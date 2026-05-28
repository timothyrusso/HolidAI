import { Modals, Routes, navigationService } from '@/features/core/navigation';
import { CustomHeader, icons } from '@/features/core/ui';
import { Stack } from 'expo-router';

export default function CreateTripLayout() {
  return (
    <Stack>
      <Stack.Screen
        name={Routes.GenerateTrip}
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={Routes.Search}
        options={{
          header: () => (
            <CustomHeader
              title="SEARCH_PLACE_PAGE.TITLE"
              icon={icons.arrowBack}
              onPress={() => navigationService.back()}
            />
          ),
        }}
      />
      <Stack.Screen
        name={Routes.ReviewTrip}
        options={{
          header: () => (
            <CustomHeader title="REVIEW_TRIP.TITLE" icon={icons.arrowBack} onPress={() => navigationService.back()} />
          ),
        }}
      />
      <Stack.Screen
        name={Routes.SelectBudget}
        options={{
          header: () => (
            <CustomHeader title="SELECT_BUDGET.TITLE" icon={icons.arrowBack} onPress={() => navigationService.back()} />
          ),
        }}
      />
      <Stack.Screen
        name={Routes.SelectDates}
        options={{
          header: () => (
            <CustomHeader title="SELECT_DATES.TITLE" icon={icons.arrowBack} onPress={() => navigationService.back()} />
          ),
        }}
      />
      <Stack.Screen
        name={Routes.SelectTraveler}
        options={{
          header: () => (
            <CustomHeader
              title="SELECT_TRAVELERS.TITLE"
              icon={icons.arrowBack}
              onPress={() => navigationService.back()}
            />
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
      <Stack.Screen
        name={Modals.TypicalDishes}
        options={{
          presentation: 'formSheet',
          headerShown: false,
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.5, 1.0],
          sheetInitialDetentIndex: 0,
        }}
      />
    </Stack>
  );
}
