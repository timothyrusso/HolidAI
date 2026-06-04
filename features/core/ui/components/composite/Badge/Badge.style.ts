import { colors } from '@/features/core/ui/style/colors';
import { components } from '@/features/core/ui/style/dimensions/components';
import { fontSize } from '@/features/core/ui/style/dimensions/fontSize';
import { spacing } from '@/features/core/ui/style/dimensions/spacing';
import { fontFamily } from '@/features/core/ui/style/fontFamily';
import { StyleSheet } from 'react-native';

export const styles = (active: boolean, backgroundColor: string) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      gap: spacing.Single,
    },
    circleWrapper: {
      width: components.badgeCircleSize,
      height: components.badgeCircleSize,
    },
    circle: {
      width: components.badgeCircleSize,
      height: components.badgeCircleSize,
      borderRadius: components.badgeCircleSize / 2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: active ? backgroundColor : colors.primaryRed,
    },
    checkBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: components.badgeCheckSize,
      height: components.badgeCheckSize,
      borderRadius: components.badgeCheckSize / 2,
      backgroundColor: colors.primaryWhite,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeImage: {
      width: components.badgeCircleSize * 0.6,
      height: components.badgeCircleSize * 0.6,
    },
    label: {
      fontSize: fontSize.XS,
      fontFamily: fontFamily.interBold,
      color: colors.primaryBlack,
      textAlign: 'center',
    },
  });
