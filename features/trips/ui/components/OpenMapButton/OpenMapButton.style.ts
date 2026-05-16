import { colors, fontFamily, fontSize, opacity, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
    borderRadius: spacing.Fourfold,
    padding: spacing.Double,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: spacing.SingleAndHalf,
  },
  icon: {
    backgroundColor: colors.primaryBlue,
    borderRadius: spacing.Triple,
    padding: spacing.Single,
  },
  title: {
    fontSize: fontSize.SM,
    fontFamily: fontFamily.interBold,
    color: colors.primaryBlack,
  },
  pressed: {
    opacity: opacity.default,
  },
});
