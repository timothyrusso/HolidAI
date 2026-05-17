import { spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    gap: spacing.Double,
  },
  label: {
    marginBottom: spacing.Minimal,
  },
});
