import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    left: spacing.SingleAndHalf + spacing.Minimal,
  },
  skeleton: {
    flex: 1,
    bottom: spacing.Minimal,
    backgroundColor: colors.primaryBlack,
    borderRadius: spacing.Quintuple,
    height: spacing.separator40,
    width: spacing.separator120 + spacing.SingleAndHalf,
  },
});
