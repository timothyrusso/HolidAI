import { CustomIcon, CustomImage, colors, icons, spacing } from '@/features/core/ui';
import { useMainListItemLogic } from '@/features/trips/ui/components/MainPlacesList/components/MainListItem/MainListItem.logic';
import { styles } from '@/features/trips/ui/components/MainPlacesList/components/MainListItem/MainListItem.style';
import type { FC } from 'react';
import { View } from 'react-native';

type MainListItemProps = {
  id: string;
  index: number;
};

export const MainListItem: FC<MainListItemProps> = ({ id, index }) => {
  const { data, MIN_MAIN_LIST_ITEM_INDEX } = useMainListItemLogic(id);

  return index === MIN_MAIN_LIST_ITEM_INDEX ? (
    <View style={styles.lastItem}>
      <CustomIcon name={icons.star} size={spacing.Triple} color={colors.primaryBlack} />
    </View>
  ) : (
    <CustomImage source={typeof data === 'string' ? { uri: data } : data} style={styles.image} />
  );
};
