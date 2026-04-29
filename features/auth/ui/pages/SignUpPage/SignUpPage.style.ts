import { PlatformOS } from '@/ui/PlatformOS';
import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  title: {
    fontFamily: fontFamily.interBold,
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
    fontFamily: fontFamily.interRegular,
    fontSize: spacing.Triple,
    alignSelf: 'flex-start',
    ...(Platform.OS === PlatformOS.ios && { marginTop: spacing.Double }),
  },
  subtitle: {
    fontFamily: fontFamily.interMedium,
    fontSize: spacing.Triple,
    textAlign: 'center',
    color: colors.primaryGrey,
    paddingTop: spacing.Double,
  },
  textButton: {
    fontFamily: fontFamily.interBold,
    textAlign: 'right',
    color: colors.tertiaryBlue,
    fontSize: spacing.Double + spacing.Minimal,
  },
  labelText: {
    fontFamily: fontFamily.interMedium,
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
