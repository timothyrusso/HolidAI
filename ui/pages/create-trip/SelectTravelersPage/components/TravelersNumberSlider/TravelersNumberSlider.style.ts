import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { fonts } from '@/ui/constants/style/fonts';
import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  slider: {
    height: spacing.Sextuple,
    borderWidth: 1,
    width: '90%',
    borderRadius: spacing.Triple,
  },
  title: {
    fontSize: spacing.Triple,
    fontFamily: fonts.interMedium,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingBottom: spacing.Triple,
    paddingHorizontal: spacing.Fourfold,
    columnGap: spacing.Triple,
  },
  subtitle: {
    fontSize: spacing.Triple,
    fontFamily: fonts.interMedium,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: spacing.Fourfold,
    paddingHorizontal: spacing.Minimal,
    paddingVertical: spacing.Minimal,
    width: spacing.Quintuple,
    height: spacing.Quintuple,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
