import { colors } from '@/ui/constants/style/colors';
import { breakpoints } from '@/ui/constants/style/dimensions/breakpoints';
import { images } from '@/ui/constants/style/dimensions/images';
import { SCREEN_HEIGHT, spacing } from '@/ui/constants/style/dimensions/spacing';
import { fonts } from '@/ui/constants/style/fonts';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleFirstLine: {
    fontFamily: fonts.interBold,
    fontSize: spacing.Quintuple,
    textAlign: 'center',
    lineHeight: spacing.Quintuple + spacing.Double,
  },
  titleSecondLine: {
    fontFamily: fonts.interBold,
    fontSize: spacing.Quintuple,
    textAlign: 'center',
    lineHeight: spacing.Quintuple + spacing.Double,
  },
  peopleText: {
    fontFamily: fonts.interBold,
    fontSize: spacing.Quintuple,
    textAlign: 'center',
    lineHeight: spacing.Quintuple + spacing.Double,
    color: colors.tertiaryBlue,
  },
  subtitle: {
    fontFamily: fonts.interMedium,
    fontSize: spacing.Double + spacing.Minimal,
    textAlign: 'center',
    color: colors.primaryGrey,
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
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: spacing.Fourfold,
    paddingBottom: spacing.Triple,
    paddingHorizontal: spacing.Fourfold,
  },
});
