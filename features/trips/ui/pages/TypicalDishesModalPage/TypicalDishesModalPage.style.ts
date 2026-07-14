import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/features/core/ui';

export const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: spacing.Quintuple,
    paddingHorizontal: spacing.Quintuple,
  },
  container: {
    backgroundColor: colors.primaryWhite,
  },
});
