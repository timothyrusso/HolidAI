import { StyleSheet } from 'react-native';
import { colors, fontFamily, fontSize, spacing } from '@/features/core/ui';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.Double,
  },
  title: {
    fontFamily: fontFamily.interBold,
    fontSize: fontSize.SM,
    color: colors.primaryGrey,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.SingleAndHalf,
    width: '100%',
  },
});
