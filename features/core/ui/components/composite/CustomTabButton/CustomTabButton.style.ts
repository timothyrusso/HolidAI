import { colors } from '@/features/core/ui/style/colors';
import { fontSize } from '@/features/core/ui/style/dimensions/fontSize';
import { spacing } from '@/features/core/ui/style/dimensions/spacing';
import { fontFamily } from '@/features/core/ui/style/fontFamily';
import { opacity } from '@/features/core/ui/style/opacity';
import { shadows } from '@/features/core/ui/style/shadows';
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
    fontSize: fontSize.SM,
    fontFamily: fontFamily.interMedium,
  },
  focusedIcon: {
    color: colors.primary,
  },
  pressed: {
    opacity: opacity.default,
  },
});
