import { colors, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
  },
  contentContainer: {
    paddingBottom: spacing.Double,
    alignItems: 'center',
  },
  list: {
    rowGap: spacing.SingleAndHalf,
    alignContent: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: colors.primaryGrey,
    marginVertical: spacing.SingleAndHalf,
  },
});
