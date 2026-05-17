import { components, spacing } from '@/features/core/ui';
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
