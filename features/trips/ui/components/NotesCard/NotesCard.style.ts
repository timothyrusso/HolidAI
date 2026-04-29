import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
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
      fontSize: spacing.Double,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.SingleAndHalf,
      marginBottom: spacing.SingleAndHalf,
      justifyContent: isTitleInverted ? 'flex-end' : 'flex-start',
    },
  });
