import { colors } from '@/ui/constants/style/colors';
import { icons } from '@/ui/constants/style/icons';
import type { FC } from 'react';
import { View } from 'react-native';
import type { Region } from 'react-native-maps';
import type { AllCoordinates } from '../../TripDetailsPage.logic';
import { MapListHeaderComponent } from '../MapListHeaderComponent/MapListHeaderComponent';
import { NotesCard } from '../NotesCard/NotesCard';
import { style } from './ListHeaderComponent.style';

type ListHeaderComponentProps = {
  region: Region;
  allCoordinates: AllCoordinates[];
  budgetNotes: string;
  transportationNotes: string;
};

export const ListHeaderComponent: FC<ListHeaderComponentProps> = ({
  region,
  allCoordinates,
  budgetNotes,
  transportationNotes,
}) => {
  return (
    <View style={style.container}>
      <MapListHeaderComponent region={region} allCoordinates={allCoordinates} />
      <NotesCard
        title="TRIP_DETAILS.BUDGET_NOTES"
        icon={icons.card}
        notes={budgetNotes}
        backgroundColor={colors.primaryBlue}
      />
      <NotesCard
        title="TRIP_DETAILS.TRANSPORTATION_NOTES"
        icon={icons.bus}
        notes={transportationNotes}
        isTitleInverted
        backgroundColor={colors.secondaryPink}
      />
    </View>
  );
};
