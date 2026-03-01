import { components } from '@/ui/style/dimensions/components';
import { spacing } from '@/ui/style/dimensions/spacing';
import { StyleSheet } from 'react-native';

const BORDER_SIZE = 15;

export const style = StyleSheet.create({
  innerMask: {
    position: 'absolute',
    top: BORDER_SIZE,
    left: BORDER_SIZE,
    right: BORDER_SIZE,
    bottom: BORDER_SIZE,
    backgroundColor: 'white',
    borderRadius: spacing.separator40,
    borderCurve: 'continuous',
  },
  animationContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: spacing.Fourfold,
    alignItems: 'center',
  },
  animation: {
    flex: 1,
    width: '100%',
    height: components.tripAnimationHeight,
    paddingHorizontal: spacing.Fourfold,
  },
});
