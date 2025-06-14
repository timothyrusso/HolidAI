import { colors } from '@/ui/constants/style/colors';
import { components } from '@/ui/constants/style/dimensions/components';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { fonts } from '@/ui/constants/style/fonts';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    rowGap: spacing.Quintuple,
  },
  button: {
    alignSelf: 'center',
    width: components.customButtonWidth,
    zIndex: 2,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  logo: {
    width: components.welcomeLogoHeight,
    height: components.welcomeLogoHeight,
    alignSelf: 'center',
    zIndex: 2,
  },
  title: {
    fontFamily: fonts.arimaBold,
    fontSize: spacing.Fourfold,
    zIndex: 2,
    color: colors.primaryWhite,
    textAlign: 'center',
  },
  logoContainer: {
    width: '100%',
  },
});
