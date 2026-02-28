import { Routes } from '@/modules/navigation/domain/entities/routes';
import type { UniqueItem } from '@/modules/shared/hooks/useUniqueItems';
import type { UserTrips } from '@/modules/trips/domain/dto/UserTripsDTO';
import { BaseSkeleton } from '@/ui/components/basic/BaseSkeleton/BaseSkeleton';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { FlatList } from 'react-native';
import { TripCard } from '../../components/TripCard/TripCard';
import { useShowAllTripsPageLogic } from './ShowAllTripsPage.logic';
import { styles } from './ShowAllTripsPage.style';

const renderItem = (item: UserTrips | UniqueItem) => {
  const isSkeleton = 'uuid' in item;
  return isSkeleton ? <BaseSkeleton style={styles.skeleton} /> : <TripCard item={item} />;
};

export const ShowAllTripsPage = () => {
  const { userTrips } = useShowAllTripsPageLogic();

  return (
    <BasicView nameView={Routes.ShowAllTrips} statusBarStyle="dark">
      <FlatList<UserTrips | UniqueItem>
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
