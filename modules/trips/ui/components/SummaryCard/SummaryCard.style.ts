import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fonts } from '@/ui/style/fonts';
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
    fontSize: spacing.Double,
    fontFamily: fonts.interMedium,
  },
  value: {
    fontSize: spacing.Double,
    fontFamily: fonts.interBold,
  },
  destination: {
    fontSize: spacing.Double,
    fontFamily: fonts.interBold,
    backgroundColor: colors.primary,
    padding: spacing.Single,
    borderRadius: spacing.Double,
    color: colors.primaryWhite,
  },
});
