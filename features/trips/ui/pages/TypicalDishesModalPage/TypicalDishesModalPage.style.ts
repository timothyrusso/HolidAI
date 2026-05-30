import { colors, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: spacing.Quintuple,
    paddingHorizontal: spacing.Quintuple,
  },
  container: {
    backgroundColor: colors.primaryWhite,
  },
});
