import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fonts } from '@/ui/style/fonts';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    width: spacing.separator40 + spacing.Triple,
    height: spacing.separator40 + spacing.Triple,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: spacing.separator40 + spacing.Triple,
  },
  focusedText: {
    color: colors.primary,
    fontSize: spacing.Double,
    fontFamily: fonts.interMedium,
  },
  focusedIcon: {
    color: colors.primary,
  },
  text: {
    color: colors.primaryGrey,
    fontSize: spacing.Double,
    marginTop: spacing.Single,
    fontFamily: fonts.interRegular,
  },
});
