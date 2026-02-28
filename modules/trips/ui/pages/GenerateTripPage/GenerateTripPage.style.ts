import { components } from '@/ui/style/dimensions/components';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fonts } from '@/ui/style/fonts';
import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  animation: {
    flex: 1,
    width: '100%',
    height: components.tripAnimationHeight,
    paddingHorizontal: spacing.Fourfold,
  },
  title: {
    fontSize: spacing.Quintuple,
    fontFamily: fonts.interBold,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.Fourfold,
  },
  animationContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: spacing.Fourfold,
  },
});
