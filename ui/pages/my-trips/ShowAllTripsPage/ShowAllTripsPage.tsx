import type { UserTrips } from '@/modules/trip/domain/dto/UserTripsDTO';
import { BaseSkeleton } from '@/ui/components/basic/BaseSkeleton/BaseSkeleton';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { Routes } from '@/ui/constants/navigation/routes';
import type { UniqueItem } from '@/ui/hooks/useUniqueItems';
import { FlatList } from 'react-native';
import { useShowAllTripsPageLogic } from './ShowAllTripsPage.logic';
import { styles } from './ShowAllTripsPage.style';
import { TripCard } from './components/TripCard/TripCard';

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
        keyExtractor={item => ('tripId' in item ? item.tripId : item.uuid)}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
    </BasicView>
  );
};
