import { PlatformOS } from '@/ui/constants/PlatformOS';
import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { fonts } from '@/ui/constants/style/fonts';
import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.interBold,
    fontSize: spacing.Fourfold,
  },
  inputContainer: {
    paddingTop: spacing.Quintuple,
    width: '100%',
    paddingHorizontal: spacing.Fourfold,
    rowGap: spacing.Fourfold,
  },
  buttonContainer: {
    paddingTop: spacing.separator80,
    width: '100%',
    paddingHorizontal: spacing.Fourfold,
    rowGap: spacing.Triple,
  },
  container: {
    width: '100%',
  },
  verifyContainer: {
    width: '100%',
    paddingHorizontal: spacing.Fourfold,
    justifyContent: 'flex-start',
    paddingTop: spacing.Fourfold,
  },
  verifyContent: {
    width: '100%',
    rowGap: spacing.Fourfold,
  },
  verifyTitle: {
    fontFamily: fonts.interRegular,
    fontSize: spacing.Triple,
    alignSelf: 'flex-start',
    ...(Platform.OS === PlatformOS.ios && { marginTop: spacing.Double }),
  },
  subtitle: {
    fontFamily: fonts.interMedium,
    fontSize: spacing.Triple,
    textAlign: 'center',
    color: colors.primaryGrey,
    paddingTop: spacing.Double,
  },
  textButton: {
    fontFamily: fonts.interBold,
    textAlign: 'right',
    color: colors.tertiaryBlue,
    fontSize: spacing.Double + spacing.Minimal,
  },
  labelText: {
    fontFamily: fonts.interMedium,
    color: colors.primaryGrey,
    alignSelf: 'flex-end',
    fontSize: spacing.Double + spacing.Minimal,
  },
  alreadyAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: spacing.Minimal,
  },
});
