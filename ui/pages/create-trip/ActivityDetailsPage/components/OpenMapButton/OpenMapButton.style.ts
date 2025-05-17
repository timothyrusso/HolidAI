import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { fonts } from '@/ui/constants/style/fonts';
import { opacity } from '@/ui/constants/style/opacity';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
    borderRadius: spacing.Fourfold,
    padding: spacing.Double,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: spacing.SingleAndHalf,
  },
  icon: {
    backgroundColor: colors.primaryBlue,
    borderRadius: spacing.Triple,
    padding: spacing.Single,
  },
  title: {
    fontSize: spacing.Double,
    fontFamily: fonts.interBold,
    color: colors.primaryBlack,
  },
  pressed: {
    opacity: opacity.default,
  },
});
