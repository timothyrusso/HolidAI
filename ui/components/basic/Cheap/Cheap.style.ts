import { colors } from '@/ui/style/colors';
import { fontSize } from '@/ui/style/dimensions/fontSize';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
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
      fontSize: fontSize.XS,
      fontFamily: fontFamily.interBold,
      textAlign: 'center',
    },
  });
