import { colors } from '@/ui/style/colors';
import { fontSize } from '@/ui/style/dimensions/fontSize';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
import { opacity } from '@/ui/style/opacity';
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
      fontSize: fontSize.LG,
      fontFamily: fontFamily.interMedium,
    },
    skeleton: {
      width: '100%',
      borderRadius: spacing.Double,
      height: spacing.separator80,
    },
  });
