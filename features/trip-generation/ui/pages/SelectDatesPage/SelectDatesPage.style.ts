import { colors } from '@/ui/style/colors';
import { components } from '@/ui/style/dimensions/components';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fonts } from '@/ui/style/fonts';
import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingBottom: components.bottomMenuHeight,
  },
  calendar: {
    paddingVertical: spacing.TripleAndHalf,
    marginTop: spacing.Double,
  },
  calendarText: {
    fontFamily: fonts.interMedium,
  },
  calendarDayText: {
    color: colors.primaryWhite,
  },
  subtitle: {
    marginVertical: spacing.Fourfold,
    fontSize: spacing.Triple,
    fontFamily: fonts.interMedium,
    alignSelf: 'flex-start',
  },
  rangeSelection: {
    borderTopLeftRadius: spacing.separator40,
    borderTopRightRadius: spacing.separator40,
    borderBottomLeftRadius: spacing.separator40,
    borderBottomRightRadius: spacing.separator40,
  },
  contentScrollViewContainer: {
    width: '100%',
    paddingHorizontal: spacing.Fourfold,
  },
});
