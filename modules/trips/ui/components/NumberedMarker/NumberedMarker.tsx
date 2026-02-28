import CustomText from '@/ui/components/basic/CustomText/CustomText';
import type { FC } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';
import { styles } from './NumberedMarket.style';

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
