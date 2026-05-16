import { StyleSheet } from 'react-native';

import { colors } from '@/features/core/ui/style/colors';
import { spacing } from '@/features/core/ui/style/dimensions/spacing';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryWhite,
    borderTopLeftRadius: spacing.Triple,
    borderTopRightRadius: spacing.Triple,
  },
});
