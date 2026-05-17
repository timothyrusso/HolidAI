import { colors, fontFamily, fontSize, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryBlack,
    width: spacing.Quintuple,
    height: spacing.Quintuple,
    borderRadius: spacing.Quintuple,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: spacing.Minimal,
    borderColor: colors.primaryWhite,
  },
  number: {
    color: colors.primaryWhite,
    fontSize: fontSize.SM,
    fontFamily: fontFamily.interBold,
  },
});
