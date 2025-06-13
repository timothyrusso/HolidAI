import { PlatformOS } from '@/ui/constants/PlatformOS';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { fonts } from '@/ui/constants/style/fonts';
import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.interBold,
    fontSize: spacing.Fourfold,
  },
  emailContainer: {
    paddingTop: spacing.Triple,
  },
  passwordContainer: {
    paddingVertical: spacing.Triple,
    rowGap: spacing.Triple,
  },
  label: {
    marginBottom: spacing.Single,
  },
  inputContainer: {
    ...(Platform.OS === PlatformOS.ios && { paddingTop: spacing.Triple }),
    width: '100%',
    paddingHorizontal: spacing.Fourfold,
  },
  buttonContainer: {
    paddingTop: spacing.separator40,
    width: '100%',
    paddingHorizontal: spacing.Fourfold,
    paddingBottom: spacing.Fourfold,
  },
  container: {
    width: '100%',
  },
  verifyContainer: {
    width: '100%',
    paddingHorizontal: spacing.Fourfold,
    justifyContent: 'flex-start',
  },
  verifyContent: {
    width: '100%',
    rowGap: spacing.Double,
  },
  verifyTitle: {
    fontFamily: fonts.interRegular,
    fontSize: spacing.Triple,
    alignSelf: 'flex-start',
    ...(Platform.OS === PlatformOS.ios && { marginTop: spacing.Double }),
  },
});
