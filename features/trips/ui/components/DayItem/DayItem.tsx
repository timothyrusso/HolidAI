import type { DayPlan } from '@/features/trips';
import type { FC } from 'react';
import { FlatList, View } from 'react-native';
import { ActivityItem } from '../ActivityItem/ActivityItem';
import { styles } from './DayItem.style';

type DayItemProps = {
  dayPlan: DayPlan;
  location: string;
  tripId: string;
  currency: string;
};

const Separator = () => <View style={styles.separator} />;

export const DayItem: FC<DayItemProps> = ({ dayPlan, location, tripId, currency }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={dayPlan.schedule}
        keyExtractor={item => `${item.placeNumberID}-${item.placeName}`}
        renderItem={({ item }) => (
          <ActivityItem scheduleItem={item} day={dayPlan.day} location={location} tripId={tripId} currency={currency} />
        )}
        ItemSeparatorComponent={Separator}
        style={styles.list}
      />
    </View>
  );
};
