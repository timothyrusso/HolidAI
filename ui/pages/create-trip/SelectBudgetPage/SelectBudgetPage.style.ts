import { SCREEN_WIDTH, spacing } from '@/ui/style/dimensions/spacing';
import { fonts } from '@/ui/style/fonts';
import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  subtitle: {
    marginVertical: spacing.Fourfold,
    fontSize: spacing.Triple,
    fontFamily: fonts.interMedium,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.Fourfold,
  },
  separator: {
    height: spacing.TripleAndHalf,
  },
  list: {
    paddingHorizontal: spacing.Fourfold,
    paddingTop: spacing.Double,
  },
  contentContainer: {
    paddingBottom: spacing.Triple,
  },
  columnWrapper: {
    gap: spacing.Triple,
  },
  twoColumnCard: {
    width: (SCREEN_WIDTH - spacing.Fourfold * 3) / 2,
  },
});
