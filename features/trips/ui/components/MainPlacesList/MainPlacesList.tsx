import { BaseSkeleton } from '@/features/core/ui';
import { useMainPlacesListLogic } from '@/features/trips/ui/components/MainPlacesList/MainPlacesList.logic';
import { styles } from '@/features/trips/ui/components/MainPlacesList/MainPlacesList.style';
import { MainListItem } from '@/features/trips/ui/components/MainPlacesList/components/MainListItem/MainListItem';
import { FlatList } from 'react-native';

export const MainPlacesList = () => {
  const { listItems, isLoading } = useMainPlacesListLogic();

  return isLoading ? (
    <BaseSkeleton style={styles.skeleton} />
  ) : (
    <FlatList
      data={listItems}
      renderItem={({ item, index }) => <MainListItem index={index} photoResourceName={item?.photoResourceName} />}
      style={styles.container}
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => `${item?.id}-${index}`}
      horizontal
    />
  );
};
