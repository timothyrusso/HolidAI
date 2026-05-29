import { CustomIcon, CustomText, colors, icons, spacing } from '@/features/core/ui';
import { useTypicalDishesHeaderLogic } from '@/features/trips/ui/components/TypicalDishesHeader/TypicalDishesHeader.logic';
import { styles } from '@/features/trips/ui/components/TypicalDishesHeader/TypicalDishesHeader.style';
import type { FC } from 'react';
import { View } from 'react-native';

type TypicalDishesHeaderProps = {
  location: string;
};

export const TypicalDishesHeader: FC<TypicalDishesHeaderProps> = ({ location }) => {
  const { location: displayLocation } = useTypicalDishesHeaderLogic(location);

  return (
    <View style={styles.container}>
      <CustomIcon name={icons.location} size={spacing.Triple} color={colors.secondaryGreen} />
      <CustomText text={displayLocation} style={styles.location} />
    </View>
  );
};
