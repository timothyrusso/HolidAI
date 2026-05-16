import { components, fontFamily, fontSize, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  subtitle: {
    marginVertical: spacing.Fourfold,
    fontSize: fontSize.LG,
    fontFamily: fontFamily.interMedium,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.Fourfold,
  },
  container: {
    justifyContent: 'flex-start',
    paddingBottom: components.bottomMenuHeight,
  },
  animation: {
    width: '100%',
    height: components.reviewPageAnimationHeight,
    marginTop: spacing.Quintuple,
  },
  summaryContainer: {
    width: '100%',
    paddingHorizontal: spacing.Fourfold,
  },
  contentScrollViewContainer: {
    width: '100%',
  },
});
