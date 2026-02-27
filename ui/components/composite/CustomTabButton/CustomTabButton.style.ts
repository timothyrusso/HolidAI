import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fonts } from '@/ui/style/fonts';
import { opacity } from '@/ui/style/opacity';
import { shadows } from '@/ui/style/shadows';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    width: spacing.separator40 + spacing.Single,
    height: spacing.separator40 + spacing.Single,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: spacing.separator40 + spacing.Single,
    boxShadow: shadows.mediumShadow,
    backgroundColor: colors.primary,
  },
  focusedText: {
    color: colors.primary,
    fontSize: spacing.Double,
    fontFamily: fonts.interMedium,
  },
  focusedIcon: {
    color: colors.primary,
  },
  pressed: {
    opacity: opacity.default,
  },
});
