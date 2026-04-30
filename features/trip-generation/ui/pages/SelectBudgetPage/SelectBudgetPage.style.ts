import { fontSize } from '@/ui/style/dimensions/fontSize';
import { SCREEN_WIDTH, spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  subtitle: {
    marginVertical: spacing.Fourfold,
    fontSize: fontSize.LG,
    fontFamily: fontFamily.interMedium,
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
