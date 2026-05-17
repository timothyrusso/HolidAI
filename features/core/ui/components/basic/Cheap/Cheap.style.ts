import { colors } from '@/features/core/ui/style/colors';
import { fontSize } from '@/features/core/ui/style/dimensions/fontSize';
import { spacing } from '@/features/core/ui/style/dimensions/spacing';
import { fontFamily } from '@/features/core/ui/style/fontFamily';
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
