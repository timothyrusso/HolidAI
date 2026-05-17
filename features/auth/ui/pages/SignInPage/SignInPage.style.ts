import { colors, fontFamily, fontSize, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  title: {
    fontFamily: fontFamily.interBold,
    fontSize: fontSize.XL2,
  },
  passwordContainer: {
    paddingVertical: spacing.Double,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: spacing.Fourfold,
    paddingTop: spacing.Quintuple,
    rowGap: spacing.Double,
  },
  buttonContainer: {
    paddingTop: spacing.separator40,
    rowGap: spacing.Triple,
    width: '100%',
    paddingHorizontal: spacing.Fourfold,
  },
  container: {
    flex: 1,
    width: '100%',
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
  subtitle: {
    fontFamily: fontFamily.interMedium,
    fontSize: fontSize.LG,
    textAlign: 'center',
    color: colors.primaryGrey,
    paddingTop: spacing.Double,
  },
  noAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: spacing.Minimal,
  },
});
