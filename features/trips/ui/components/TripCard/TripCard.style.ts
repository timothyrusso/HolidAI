import { colors } from '@/ui/style/colors';
import { components } from '@/ui/style/dimensions/components';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fonts } from '@/ui/style/fonts';
import { opacity } from '@/ui/style/opacity';
import { shadows } from '@/ui/style/shadows';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.Double,
    boxShadow: shadows.defaultShadow,
    borderRadius: spacing.Double,
  },
  image: {
    width: '100%',
    height: components.tripCardImageHeight,
    borderRadius: spacing.Double,
  },
  title: {
    fontSize: spacing.Triple,
    fontFamily: fonts.interBold,
    paddingTop: spacing.Double,
  },
  pressed: {
    opacity: opacity.default,
  },
  iconContainer: {
    position: 'absolute',
    top: spacing.TripleAndHalf,
    right: spacing.TripleAndHalf,
    backgroundColor: colors.primaryWhite,
    borderRadius: spacing.Quintuple,
    width: spacing.Quintuple,
    height: spacing.Quintuple,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: opacity.default,
    borderWidth: 1,
    borderColor: colors.secondaryGrey,
  },
});
