import { colors, components, fontFamily, fontSize, spacing } from '@/features/core/ui';
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
    fontFamily: fontFamily.interMedium,
  },
  calendarDayText: {
    color: colors.primaryWhite,
  },
  subtitle: {
    marginVertical: spacing.Fourfold,
    fontSize: fontSize.LG,
    fontFamily: fontFamily.interMedium,
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
