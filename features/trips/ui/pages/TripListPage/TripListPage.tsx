import { Routes } from '@/features/core/navigation';
import type { Trip } from '@/features/trips/domain/entities/Trip';
import { TripCard } from '@/features/trips/ui/components/TripCard/TripCard';
import { useTripListPageLogic } from '@/features/trips/ui/pages/TripListPage/TripListPage.logic';
import { styles } from '@/features/trips/ui/pages/TripListPage/TripListPage.style';
import type { UniqueItem } from '@/modules/shared/hooks/useUniqueItems';
import { BaseSkeleton } from '@/ui/components/basic/BaseSkeleton/BaseSkeleton';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { FlatList } from 'react-native';

const renderItem = (item: Trip | UniqueItem) => {
  const isSkeleton = 'uuid' in item;
  return isSkeleton ? <BaseSkeleton style={styles.skeleton} /> : <TripCard item={item} />;
};

export const TripListPage = () => {
  const { userTrips } = useTripListPageLogic();

  return (
    <BasicView nameView={Routes.ShowAllTrips} statusBarStyle="dark">
      <FlatList<Trip | UniqueItem>
        data={userTrips}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={item => ('_id' in item ? item._id : item.uuid)}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
    </BasicView>
  );
};
