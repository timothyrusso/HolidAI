import { colors, components, fontFamily, fontSize, opacity, shadows, spacing } from '@/features/core/ui';
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
    fontSize: fontSize.LG,
    fontFamily: fontFamily.interBold,
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
