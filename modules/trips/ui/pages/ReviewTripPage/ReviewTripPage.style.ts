import { components } from '@/ui/style/dimensions/components';
import { spacing } from '@/ui/style/dimensions/spacing';
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
