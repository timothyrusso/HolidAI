import { ButtonType, CustomIconButtonMedium, CustomText, icons } from '@/features/core/ui';
import { TypicalDishesHeader } from '@/features/trips/ui/components/TypicalDishesHeader/TypicalDishesHeader';
import { styles } from '@/features/trips/ui/components/TypicalDishesModalHeader/TypicalDishesModalHeader.style';
import type { FC } from 'react';
import { View } from 'react-native';

type TypicalDishesModalHeaderProps = {
  location: string;
  dishNumber: number;
  onClose: () => void;
};

export const TypicalDishesModalHeader: FC<TypicalDishesModalHeaderProps> = ({ location, dishNumber, onClose }) => (
  <View style={styles.headerRow}>
    <View style={styles.headerContent}>
      <CustomText text="MY_TRIP.TYPICAL_DISHES" style={styles.title} />
      <TypicalDishesHeader location={location} dishNumber={dishNumber} />
    </View>
    <CustomIconButtonMedium iconName={icons.close} buttonType={ButtonType.Quaternary} onPress={onClose} />
  </View>
);
