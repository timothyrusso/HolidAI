import { StyleSheet } from 'react-native';

import { colors } from '@/features/core/ui/style/colors';
import { spacing } from '@/features/core/ui/style/dimensions/spacing';

export const styles = (circleSize = spacing.separator40) =>
  StyleSheet.create({
    icon: {
      alignItems: 'center',
      alignSelf: 'center',
      alignContent: 'center',
      justifyContent: 'center',
    },
    iconSize: {
      lineHeight: circleSize,
    },
    iconOutline: {
      height: circleSize,
      width: circleSize,
      backgroundColor: colors.primaryWhite,
      borderRadius: circleSize,
    },
  });
