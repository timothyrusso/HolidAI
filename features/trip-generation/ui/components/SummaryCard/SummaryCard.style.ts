import { colors, fontFamily, fontSize, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: spacing.Fourfold,
    paddingLeft: spacing.Triple,
    paddingRight: spacing.Fourfold,
    backgroundColor: colors.secondaryGrey,
    borderRadius: spacing.Triple,
    rowGap: spacing.FourfoldAndHalf,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: spacing.Single,
  },
  label: {
    fontSize: fontSize.SM,
    fontFamily: fontFamily.interMedium,
  },
  value: {
    fontSize: fontSize.SM,
    fontFamily: fontFamily.interBold,
  },
  destination: {
    fontSize: fontSize.SM,
    fontFamily: fontFamily.interBold,
    backgroundColor: colors.primary,
    padding: spacing.Single,
    borderRadius: spacing.Double,
    color: colors.primaryWhite,
  },
});
