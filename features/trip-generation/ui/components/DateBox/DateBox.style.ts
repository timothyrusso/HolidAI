import { colors } from '@/ui/style/colors';
import { fontSize } from '@/ui/style/dimensions/fontSize';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  dateLabel: {
    fontFamily: fontFamily.interMedium,
    fontSize: fontSize.LG,
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
    fontFamily: fontFamily.interBold,
    fontSize: fontSize.LG,
    position: 'absolute',
    right: spacing.Fourfold,
  },
  rowLabelContainer: {
    flexDirection: 'row',
  },
  singleDayLabel: {
    fontFamily: fontFamily.interBold,
    fontSize: fontSize.XXS,
    color: colors.primaryWhite,
    textAlign: 'center',
    width: '80%',
  },
  singleDayLabelContainer: {
    position: 'absolute',
    right: -spacing.TripleAndHalf,
    top: -spacing.TripleAndHalf,
    backgroundColor: colors.primary,
    borderRadius: spacing.separator80,
    width: spacing.Sextuple + spacing.Minimal,
    height: spacing.Sextuple + spacing.Minimal,
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
  removeDateButton: {
    position: 'absolute',
    left: -spacing.TripleAndHalf,
    top: -spacing.TripleAndHalf,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
