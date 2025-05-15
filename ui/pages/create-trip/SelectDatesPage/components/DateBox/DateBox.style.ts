import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { fonts } from '@/ui/constants/style/fonts';
import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  dateLabel: {
    fontFamily: fonts.interMedium,
    fontSize: spacing.Triple,
    textAlign: 'center',
  },
  dateLabelContainer: {
    paddingVertical: spacing.Fourfold,
    backgroundColor: colors.secondaryGrey,
    borderRadius: spacing.Triple,
    marginTop: spacing.separator40,
    width: '80%',
    rowGap: spacing.Fourfold,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  dateValue: {
    fontFamily: fonts.interBold,
    fontSize: spacing.Triple,
    position: 'absolute',
    right: spacing.Fourfold,
  },
  rowLabelContainer: {
    flexDirection: 'row',
  },
  singleDayLabel: {
    fontFamily: fonts.interBold,
    fontSize: spacing.SingleAndHalf + spacing.HalfMinimal,
    color: colors.primaryWhite,
    textAlign: 'center',
  },
  singleDayLabelContainer: {
    position: 'absolute',
    right: -spacing.TripleAndHalf,
    top: -spacing.TripleAndHalf,
    backgroundColor: colors.primary,
    borderRadius: spacing.separator80,
    width: spacing.Sextuple,
    height: spacing.Sextuple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    columnGap: spacing.Single,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: spacing.Double,
  },
  icon: {
    transform: [{ rotate: '-45deg' }],
  },
});
