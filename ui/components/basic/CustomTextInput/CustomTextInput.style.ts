import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { fonts } from '@/ui/constants/style/fonts';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  input: {
    width: '100%',
    color: colors.primaryBlack,
    fontFamily: fonts.interRegular,
    fontSize: spacing.Triple,
  },
  container: {
    borderWidth: spacing.ThreeQuarterMinimal,
    borderColor: colors.primaryBlack,
    borderRadius: spacing.Fourfold,
    padding: spacing.Triple,
  },
});
