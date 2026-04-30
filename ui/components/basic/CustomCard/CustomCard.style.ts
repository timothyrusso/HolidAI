import { StyleSheet } from 'react-native';

import type { CustomCardStyle } from '@/ui/components/basic/CustomCard/CustomCard.logic';
import { spacing } from '@/ui/style/dimensions/spacing';
import { opacity } from '@/ui/style/opacity';

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
