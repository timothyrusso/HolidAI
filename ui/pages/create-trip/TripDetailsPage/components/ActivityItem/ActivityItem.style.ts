import { colors } from '@/ui/constants/style/colors';
import { components } from '@/ui/constants/style/dimensions/components';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { fonts } from '@/ui/constants/style/fonts';
import { opacity } from '@/ui/constants/style/opacity';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: components.activityImageHeight,
    borderTopStartRadius: spacing.Triple,
    borderTopEndRadius: spacing.Triple,
  },
  container: {
    backgroundColor: colors.primaryGreen,
    borderRadius: spacing.Triple,
    width: '100%',
    overflow: 'hidden',
  },
  content: {
    padding: spacing.Triple,
    rowGap: spacing.Double,
  },
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryWhite,
  },
  time: {
    fontSize: spacing.Double,
    fontFamily: fonts.interMedium,
    maxWidth: '80%',
  },
  place: {
    fontSize: spacing.Triple,
    fontFamily: fonts.interBold,
  },
  description: {
    fontSize: spacing.Double,
    fontFamily: fonts.interMedium,
  },
  price: {
    fontSize: spacing.Double,
    fontFamily: fonts.interMedium,
  },
  day: {
    position: 'absolute',
    top: spacing.Double,
    right: spacing.Double,
    padding: spacing.Single,
    backgroundColor: colors.primary,
    color: colors.primaryWhite,
    fontSize: spacing.Double,
    fontFamily: fonts.interBold,
    borderRadius: spacing.Fourfold,
    textAlign: 'center',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  marker: {
    position: 'absolute',
    top: spacing.Double,
    left: spacing.Double,
  },
  skeleton: {
    width: '100%',
    height: components.activityImageHeight,
    borderTopStartRadius: spacing.Triple,
    borderTopEndRadius: spacing.Triple,
    borderRadius: spacing.Triple,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.Single,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.Single,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.MinimalDouble,
  },
  rating: {
    fontSize: spacing.Double,
    fontFamily: fonts.interMedium,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  star: {
    marginBottom: spacing.Minimal,
  },
  pressed: {
    opacity: opacity.default,
  },
});
