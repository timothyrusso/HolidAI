import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { fonts } from '@/ui/constants/style/fonts';
import { opacity } from '@/ui/constants/style/opacity';
import { StyleSheet } from 'react-native';

export const styles = (isSelected: boolean) =>
  StyleSheet.create({
    container: {
      width: '100%',
      padding: spacing.Triple,
      borderWidth: isSelected ? spacing.Minimal : spacing.HalfMinimal,
      borderColor: isSelected ? colors.primary : colors.primaryGrey,
      borderRadius: spacing.Double,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: spacing.separator80,
    },
    pressed: {
      opacity: opacity.default,
    },
    language: {
      fontSize: spacing.Triple,
      fontFamily: fonts.interMedium,
    },
    skeleton: {
      width: '100%',
      borderRadius: spacing.Double,
      height: spacing.separator80,
    },
  });
