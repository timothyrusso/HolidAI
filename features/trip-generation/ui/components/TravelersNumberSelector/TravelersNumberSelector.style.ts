import { StyleSheet } from 'react-native';
import { components, spacing } from '@/features/core/ui';

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
