import { BaseSkeleton } from '@/ui/components/basic/BaseSkeleton/BaseSkeleton';
import { FlatList } from 'react-native';
import { useMainPlacesListLogic } from './MainPlacesList.logic';
import { styles } from './MainPlacesList.style';
import { MainListItem } from './components/MainListItem/MainListItem';

export const MainPlacesList = () => {
  const { listItems, isFetching } = useMainPlacesListLogic();

  return isFetching ? (
    <BaseSkeleton style={styles.skeleton} />
  ) : (
    <FlatList
      data={listItems}
      renderItem={({ item, index }) => <MainListItem id={item?.id} index={index} />}
      style={styles.container}
      scrollEnabled={false}
      keyExtractor={(item, index) => `${item?.id}-${index}`}
      horizontal
    />
  );
};
