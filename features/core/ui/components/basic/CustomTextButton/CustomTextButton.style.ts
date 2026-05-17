import { spacing } from '@/features/core/ui/style/dimensions/spacing';
import { opacity } from '@/features/core/ui/style/opacity';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  main: {
    paddingTop: spacing.Double,
  },
  pressed: {
    opacity: opacity.default,
  },
});
