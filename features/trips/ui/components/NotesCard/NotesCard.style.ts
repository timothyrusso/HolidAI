import { colors, fontFamily, fontSize, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const styles = (isTitleInverted: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.secondaryGrey,
      borderRadius: spacing.Triple,
      padding: spacing.Double,
      marginHorizontal: spacing.Fourfold,
    },
    title: {
      fontFamily: fontFamily.interBold,
    },
    notes: {
      fontSize: fontSize.SM,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.SingleAndHalf,
      marginBottom: spacing.SingleAndHalf,
      justifyContent: isTitleInverted ? 'flex-end' : 'flex-start',
    },
  });
