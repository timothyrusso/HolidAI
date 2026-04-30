import { useMainListItemLogic } from '@/features/trips/ui/components/MainPlacesList/components/MainListItem/MainListItem.logic';
import { styles } from '@/features/trips/ui/components/MainPlacesList/components/MainListItem/MainListItem.style';
import { CustomIcon } from '@/ui/components/basic/CustomIcon/CustomIcon';
import { CustomImage } from '@/ui/components/basic/CustomImage/CustomImage';
import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { icons } from '@/ui/style/icons';
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
