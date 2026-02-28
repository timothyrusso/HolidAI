import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fonts } from '@/ui/style/fonts';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryBlack,
    width: spacing.Quintuple,
    height: spacing.Quintuple,
    borderRadius: spacing.Quintuple,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primaryWhite,
  },
  number: {
    color: colors.primaryWhite,
    fontSize: spacing.Double,
    fontFamily: fonts.interBold,
  },
});
