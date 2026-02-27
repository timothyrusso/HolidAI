import { spacing } from '@/ui/style/dimensions/spacing';
import { opacity } from '@/ui/style/opacity';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  main: {
    paddingTop: spacing.Double,
  },
  pressed: {
    opacity: opacity.default,
  },
});
