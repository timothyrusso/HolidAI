import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { fonts } from '@/ui/constants/style/fonts';
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
      fontFamily: fonts.interBold,
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
