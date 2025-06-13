import { spacing } from '@/ui/constants/style/dimensions/spacing';
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
