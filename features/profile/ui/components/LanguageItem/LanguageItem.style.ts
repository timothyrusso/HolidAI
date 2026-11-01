import { StyleSheet } from 'react-native';
import { colors, fontFamily, fontSize, opacity, spacing } from '@/features/core/design-system';

export const styles = (isSelected: boolean) =>
  StyleSheet.create({
    container: {
      width: '100%',
      padding: spacing.Triple,
      borderWidth: isSelected ? spacing.Minimal : spacing.HalfMinimal,
      borderColor: isSelected ? colors.purple500 : colors.primaryGrey,
      borderRadius: spacing.Double,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: spacing.separator80,
    },
    pressed: {
      opacity: opacity.opacity60,
    },
    language: {
      fontSize: fontSize.LG,
      fontFamily: fontFamily.interMedium,
    },
  });
