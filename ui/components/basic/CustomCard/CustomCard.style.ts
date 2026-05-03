import { StyleSheet, type ViewStyle } from 'react-native';

import { spacing } from '@/ui/style/dimensions/spacing';
import { opacity } from '@/ui/style/opacity';

export type CustomCardStyle = {
  backgroundColor: ViewStyle['backgroundColor'];
  borderColor: ViewStyle['borderColor'];
  borderWidth: ViewStyle['borderWidth'];
};

export const styles = ({ backgroundColor, borderColor, borderWidth }: CustomCardStyle) =>
  StyleSheet.create({
    pressable: {
      borderWidth,
      borderRadius: spacing.Fourfold,
      backgroundColor,
      borderColor,
    },
    pressed: {
      opacity: opacity.default,
    },
  });
