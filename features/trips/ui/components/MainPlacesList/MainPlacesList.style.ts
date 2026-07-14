import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/features/core/ui';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skeleton: {
    flex: 1,
    backgroundColor: colors.primaryBlack,
    borderRadius: spacing.Quintuple,
    height: spacing.separator40,
    maxWidth: spacing.separator120 + spacing.MinimalDouble,
  },
});
