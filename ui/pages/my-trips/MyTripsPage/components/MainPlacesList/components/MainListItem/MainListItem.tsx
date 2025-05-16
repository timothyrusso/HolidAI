import { CustomIcon } from '@/ui/components/basic/CustomIcon/CustomIcon';
import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { icons } from '@/ui/constants/style/icons';
import type { FC } from 'react';
import { Image, View } from 'react-native';
import { useMainListItemLogic } from './MainListItem.logic';
import { styles } from './MainListItem.style';

type MainListItemProps = {
  id?: string;
  index?: number;
};

export const MainListItem: FC<MainListItemProps> = ({ id, index }) => {
  const { data, MIN_MAIN_LIST_ITEM_INDEX } = useMainListItemLogic(id);

  return index === MIN_MAIN_LIST_ITEM_INDEX ? (
    <View style={styles.lastItem}>
      <CustomIcon name={icons.add} size={spacing.Triple} color={colors.primaryBlack} />
    </View>
  ) : (
    <Image source={{ uri: data }} style={styles.image} />
  );
};
