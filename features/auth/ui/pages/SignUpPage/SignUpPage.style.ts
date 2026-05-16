import { PlatformOS, colors, fontFamily, fontSize, spacing } from '@/features/core/ui';
import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  title: {
    fontFamily: fontFamily.interBold,
    fontSize: fontSize.XL2,
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
    fontSize: fontSize.LG,
    alignSelf: 'flex-start',
    ...(Platform.OS === PlatformOS.ios && { marginTop: spacing.Double }),
  },
  subtitle: {
    fontFamily: fontFamily.interMedium,
    fontSize: fontSize.LG,
    textAlign: 'center',
    color: colors.primaryGrey,
    paddingTop: spacing.Double,
  },
  textButton: {
    fontFamily: fontFamily.interBold,
    textAlign: 'right',
    color: colors.tertiaryBlue,
    fontSize: fontSize.MD,
  },
  labelText: {
    fontFamily: fontFamily.interMedium,
    color: colors.primaryGrey,
    alignSelf: 'flex-end',
    fontSize: fontSize.MD,
  },
  alreadyAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: spacing.Minimal,
  },
});
