import { colors } from '@/ui/style/colors';
import { components } from '@/ui/style/dimensions/components';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: components.activityImageHeight,
  },
  container: {
    borderRadius: spacing.Triple,
    width: '100%',
    borderWidth: spacing.MinimalDouble,
    borderColor: colors.primary,
  },
  innerContainer: {
    overflow: 'hidden',
    borderTopStartRadius: spacing.Double,
    borderTopEndRadius: spacing.Double,
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
    fontSize: spacing.SingleAndHalf + spacing.Minimal,
    fontFamily: fontFamily.interMedium,
    maxWidth: '80%',
  },
  place: {
    fontSize: spacing.Triple,
    fontFamily: fontFamily.interBold,
  },
  description: {
    fontSize: spacing.Double,
    fontFamily: fontFamily.interMedium,
  },
  price: {
    fontSize: spacing.Double,
    fontFamily: fontFamily.interMedium,
  },
  day: {
    position: 'absolute',
    top: spacing.Double,
    right: spacing.Double,
    padding: spacing.Single,
    backgroundColor: colors.primary,
    color: colors.primaryWhite,
    fontSize: spacing.Double,
    fontFamily: fontFamily.interBold,
    borderRadius: spacing.Fourfold,
    textAlign: 'center',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  marker: {
    position: 'absolute',
    top: -spacing.Fourfold,
    alignSelf: 'center',
    zIndex: 1,
    width: spacing.Sextuple,
    height: spacing.Sextuple,
    borderColor: colors.primary,
    borderWidth: spacing.MinimalDouble,
    borderRadius: spacing.Sextuple / 2,
  },
  skeleton: {
    width: '100%',
    height: components.activityImageHeight,
    borderTopStartRadius: spacing.Double,
    borderTopEndRadius: spacing.Double,
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
    flexWrap: 'wrap',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.MinimalDouble,
  },
  rating: {
    fontSize: spacing.Double,
    fontFamily: fontFamily.interMedium,
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
    borderColor: colors.primaryBlack,
  },
});
