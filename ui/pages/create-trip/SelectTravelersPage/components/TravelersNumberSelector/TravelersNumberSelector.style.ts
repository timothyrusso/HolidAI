import { components } from '@/ui/style/dimensions/components';
import { spacing } from '@/ui/style/dimensions/spacing';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    width: components.buttonNumberHeight,
    height: components.buttonNumberHeight,
  },
  separator: {
    width: spacing.SingleAndHalf,
  },
  list: {
    maxHeight: components.buttonNumberHeight,
  },
});
