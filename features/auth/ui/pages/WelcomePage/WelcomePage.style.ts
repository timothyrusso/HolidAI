import { colors } from '@/ui/style/colors';
import { breakpoints } from '@/ui/style/dimensions/breakpoints';
import { fontSize } from '@/ui/style/dimensions/fontSize';
import { images } from '@/ui/style/dimensions/images';
import { SCREEN_HEIGHT, spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.Quintuple,
  },
  titleFirstLine: {
    fontFamily: fontFamily.interExtraBold,
    fontSize: fontSize.XL3,
    textAlign: 'center',
  },
  titleSecondLine: {
    fontFamily: fontFamily.interExtraBold,
    fontSize: fontSize.XL3,
    textAlign: 'center',
    color: colors.primaryBlue,
  },
  contentContainer: {
    width: '100%',
    justifyContent: 'space-between',
    flex: 1,
  },
  image: {
    marginTop: SCREEN_HEIGHT < breakpoints.smallDevicesHeight ? 0 : '20%',
    width: '100%',
    height: images.welcomeImageHeight,
    resizeMode: 'contain',
  },
  logoRound: {
    width: images.logoRoundWidth,
    height: images.logoRoundHeight,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    rowGap: spacing.Fourfold,
    paddingBottom: spacing.separator80,
    paddingHorizontal: spacing.Fourfold,
  },
});
