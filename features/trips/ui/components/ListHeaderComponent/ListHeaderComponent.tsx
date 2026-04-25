import type { Food, TripDetails, Weather } from '@/features/trips';
import { FoodCard } from '@/features/trips/ui/components/FoodCard/FoodCard';
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
import { style } from './ListHeaderComponent.style';

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
