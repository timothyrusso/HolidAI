import { components } from '@/ui/constants/style/dimensions/components';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    rowGap: spacing.Quintuple,
  },
  animation: {
    width: '100%',
    height: components.travelAnimationHeight,
    zIndex: 2,
  },
  button: {
    alignSelf: 'center',
    width: components.customButtonWidth,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
