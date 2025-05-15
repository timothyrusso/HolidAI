import { StyleSheet } from 'react-native';

import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { opacity } from '@/ui/constants/style/opacity';
import type { CustomCardStyle } from './CustomCard.logic';

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
