import type { DayPlan } from '@/modules/trips/domain/dto/UserTripsDTO';
import type { FC } from 'react';
import { FlatList, View } from 'react-native';
import { ActivityItem } from '../ActivityItem/ActivityItem';
import { styles } from './DayItem.style';

type DayItemProps = {
  dayPlan: DayPlan;
  location: string;
  tripId: string;
};

const separator = () => <View style={styles.separator} />;

export const DayItem: FC<DayItemProps> = ({ dayPlan, location, tripId }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={dayPlan.schedule}
        keyExtractor={(item, index) => `${item.placeName}-${index}-${item.activity}`}
        renderItem={({ item }) => (
          <ActivityItem scheduleItem={item} day={dayPlan.day} location={location} tripId={tripId} />
        )}
        ItemSeparatorComponent={separator}
        style={styles.list}
      />
    </View>
  );
};
