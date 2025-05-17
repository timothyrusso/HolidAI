import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { fonts } from '@/ui/constants/style/fonts';
import { StyleSheet } from 'react-native';

export const styles = (color: string) =>
  StyleSheet.create({
    container: {
      backgroundColor: color || colors.primaryWhite,
      borderRadius: spacing.Fourfold,
      flexDirection: 'row',
      gap: spacing.Single,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.Single,
      paddingHorizontal: spacing.Triple,
      height: spacing.Quintuple,
    },
    title: {
      color: colors.primaryBlack,
      fontSize: spacing.SingleAndHalf + spacing.Minimal,
      fontFamily: fonts.interBold,
      textAlign: 'center',
    },
  });
