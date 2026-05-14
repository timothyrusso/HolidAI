import type { Food } from '@/features/trips/domain/entities/Food';
import type { TripDetails } from '@/features/trips/domain/entities/TripDetails';
import type { Weather } from '@/features/trips/domain/entities/Weather';
import { FoodCard } from '@/features/trips/ui/components/FoodCard/FoodCard';
import { style } from '@/features/trips/ui/components/ListHeaderComponent/ListHeaderComponent.style';
import { MapListHeaderComponent } from '@/features/trips/ui/components/MapListHeaderComponent/MapListHeaderComponent';
import { NotesCard } from '@/features/trips/ui/components/NotesCard/NotesCard';
import { TripDetailsCard } from '@/features/trips/ui/components/TripDetailsCard/TripDetailsCard';
import { WeatherCard } from '@/features/trips/ui/components/WeatherCard/WeatherCard';
import type { AllCoordinates } from '@/features/trips/ui/pages/TripDetailsPage/TripDetailsPage.logic';
import { colors } from '@/ui/style/colors';
import { icons } from '@/ui/style/icons';
import { type FC, memo } from 'react';
import { View } from 'react-native';
import type { Region } from 'react-native-maps';

type ListHeaderComponentProps = {
  region: Region;
  allCoordinates?: AllCoordinates[];
  budgetNotes?: string;
  transportationNotes?: string;
  weather?: Weather;
  tripDetails: Omit<TripDetails, 'locale' | 'location'>;
  food?: Food;
};

export const ListHeaderComponent: FC<ListHeaderComponentProps> = memo(
  ({ region, allCoordinates, budgetNotes, transportationNotes, weather, tripDetails, food }) => {
    return (
      <View style={style.container}>
        <TripDetailsCard tripDetails={tripDetails} />
        {allCoordinates && <MapListHeaderComponent region={region} allCoordinates={allCoordinates} />}
        {weather && <WeatherCard weather={weather} />}
        {food && <FoodCard food={food} />}
        {budgetNotes && (
          <NotesCard
            title="TRIP_DETAILS.BUDGET_NOTES"
            icon={icons.card}
            notes={budgetNotes}
            backgroundColor={colors.primaryBlue}
          />
        )}
        {transportationNotes && (
          <NotesCard
            title="TRIP_DETAILS.TRANSPORTATION_NOTES"
            icon={icons.bus}
            notes={transportationNotes}
            isTitleInverted
            backgroundColor={colors.secondaryPink}
          />
        )}
      </View>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.tripDetails === nextProps.tripDetails;
  },
);
