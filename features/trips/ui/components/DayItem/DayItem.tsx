import type { FC } from 'react';
import { FlatList, View } from 'react-native';
import type { DayPlan } from '@/features/trips/domain/entities/DayPlan';
import { ActivityItem } from '@/features/trips/ui/components/ActivityItem/ActivityItem';
import { styles } from '@/features/trips/ui/components/DayItem/DayItem.style';

type DayItemProps = {
  dayPlan: DayPlan;
  tripId: string;
  currency: string;
};

const Separator = () => <View style={styles.separator} />;

export const DayItem: FC<DayItemProps> = ({ dayPlan, tripId, currency }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={dayPlan.schedule}
        keyExtractor={item => `${item.placeNumberID}-${item.placeName}`}
        renderItem={({ item }) => (
          <ActivityItem scheduleItem={item} day={dayPlan.day} tripId={tripId} currency={currency} />
        )}
        ItemSeparatorComponent={Separator}
        style={styles.list}
      />
    </View>
  );
};
