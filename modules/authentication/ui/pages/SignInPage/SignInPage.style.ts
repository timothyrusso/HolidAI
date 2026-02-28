import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fonts } from '@/ui/style/fonts';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.interBold,
    fontSize: spacing.Fourfold,
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
  subtitle: {
    fontFamily: fonts.interMedium,
    fontSize: spacing.Triple,
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
