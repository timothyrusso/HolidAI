import { components } from '@/ui/constants/style/dimensions/components';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  animation: {
    flex: 1,
    width: '100%',
    height: components.tripAnimationHeight,
    position: 'absolute',
    bottom: spacing.separator80 + spacing.Double,
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
  },
  newTripContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.separator160,
  },
});
