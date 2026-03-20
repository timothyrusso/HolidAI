import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fonts } from '@/ui/style/fonts';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryWhite,
    paddingHorizontal: spacing.Fourfold,
  },
  message: {
    fontFamily: fonts.interRegular,
    fontSize: spacing.Triple,
    color: colors.primaryBlack,
    textAlign: 'center',
    marginBottom: spacing.Sextuple,
  },
  button: {
    width: '100%',
    height: spacing.Sextuple,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.FourfoldAndHalf,
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontFamily: fonts.interBold,
    fontSize: spacing.Triple,
    color: colors.primaryWhite,
    textTransform: 'uppercase',
  },
});
