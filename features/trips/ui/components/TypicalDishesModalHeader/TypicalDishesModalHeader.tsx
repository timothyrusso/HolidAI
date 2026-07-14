import type { FC } from 'react';
import { View } from 'react-native';
import { ButtonType, CustomIcon, CustomIconButtonMedium, CustomText, colors, icons, spacing } from '@/features/core/ui';
import { useTypicalDishesModalHeaderLogic } from '@/features/trips/ui/components/TypicalDishesModalHeader/TypicalDishesModalHeader.logic';
import { styles } from '@/features/trips/ui/components/TypicalDishesModalHeader/TypicalDishesModalHeader.style';

type TypicalDishesModalHeaderProps = {
  location: string;
  dishNumber: number;
  onClose: () => void;
};

export const TypicalDishesModalHeader: FC<TypicalDishesModalHeaderProps> = ({ location, dishNumber, onClose }) => {
  const { dishLabel } = useTypicalDishesModalHeaderLogic(dishNumber);

  return (
    <View style={styles.headerRow}>
      <View style={styles.headerContent}>
        <CustomText text="MY_TRIP.TYPICAL_DISHES" style={styles.title} />
        <View style={styles.locationRow}>
          <CustomIcon name={icons.location} size={spacing.Triple} color={colors.secondaryGreen} />
          <CustomText text={location} style={styles.location} numberOfLines={1} ellipsizeMode="tail" />
          <CustomText text={`✦  ${dishNumber} ${dishLabel}`} style={styles.dishNumber} />
        </View>
      </View>
      <CustomIconButtonMedium iconName={icons.close} buttonType={ButtonType.Quaternary} onPress={onClose} />
    </View>
  );
};
