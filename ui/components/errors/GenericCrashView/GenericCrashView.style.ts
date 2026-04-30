import { colors } from '@/ui/style/colors';
import { fontSize } from '@/ui/style/dimensions/fontSize';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
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
    fontFamily: fontFamily.interRegular,
    fontSize: fontSize.LG,
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
    fontFamily: fontFamily.interBold,
    fontSize: fontSize.LG,
    color: colors.primaryWhite,
    textTransform: 'uppercase',
  },
});
