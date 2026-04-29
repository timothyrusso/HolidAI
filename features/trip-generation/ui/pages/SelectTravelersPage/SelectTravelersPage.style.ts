import { SCREEN_WIDTH, spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  subtitle: {
    marginVertical: spacing.Fourfold,
    fontSize: spacing.Triple,
    fontFamily: fontFamily.interMedium,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.FourfoldAndHalf,
  },
  separator: {
    height: spacing.TripleAndHalf,
  },
  list: {
    paddingHorizontal: spacing.Fourfold,
    paddingTop: spacing.Fourfold,
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
  listTitle: {
    fontSize: spacing.Triple,
    fontFamily: fontFamily.interMedium,
    alignSelf: 'flex-start',
    paddingBottom: spacing.Fourfold,
  },
});
