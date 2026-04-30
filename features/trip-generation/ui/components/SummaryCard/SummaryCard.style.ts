import { colors } from '@/ui/style/colors';
import { fontSize } from '@/ui/style/dimensions/fontSize';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
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
