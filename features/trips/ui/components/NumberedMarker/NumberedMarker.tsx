import { CustomText } from '@/features/core/ui';
import { styles } from '@/features/trips/ui/components/NumberedMarker/NumberedMarker.style';
import type { FC } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

type NumberedMarkerProps = {
  number: number;
  style?: StyleProp<ViewStyle>;
};

export const NumberedMarker: FC<NumberedMarkerProps> = ({ number, style }) => {
  return (
    <View style={[styles.container, style]}>
      <CustomText text={number.toString()} style={styles.number} />
    </View>
  );
};
