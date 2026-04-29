import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.Fourfold,
    paddingTop: spacing.Fourfold,
    backgroundColor: colors.secondaryGrey,
    marginBottom: spacing.Double,
    paddingBottom: spacing.Triple,
    rowGap: spacing.Triple,
  },
  location: {
    fontSize: spacing.Triple,
    fontFamily: fontFamily.interBold,
    color: colors.primaryBlack,
  },
  ratingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.Single,
    backgroundColor: colors.primary,
    paddingVertical: spacing.MinimalDouble,
    paddingHorizontal: spacing.Single,
    borderRadius: spacing.Double,
  },
  ratingText: {
    fontSize: spacing.Triple,
    color: colors.primaryWhite,
    fontFamily: fontFamily.interMedium,
  },
  ratingContainer: {
    alignItems: 'flex-start',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingIcon: {
    marginBottom: spacing.Minimal,
  },
  bestTimeToVisitContainer: {
    gap: spacing.Single,
  },
  bestTimeToVisitTitle: {
    fontSize: spacing.Double,
    fontFamily: fontFamily.interMedium,
  },
  bestTimeToVisitValue: {
    fontSize: spacing.Double,
    fontFamily: fontFamily.interBold,
  },
  ticketPricingContainer: {
    gap: spacing.Single,
  },
  ticketPricingValue: {
    fontSize: spacing.Double,
    fontFamily: fontFamily.interBold,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  ticketPricingTitle: {
    fontSize: spacing.Double,
    fontFamily: fontFamily.interMedium,
  },
  priceAlert: {
    fontSize: spacing.SingleAndHalf + spacing.Minimal,
    fontFamily: fontFamily.interRegular,
  },
  priceAlertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.Minimal,
    paddingRight: spacing.Fourfold,
  },
  mapLink: {
    position: 'absolute',
    top: spacing.Fourfold,
    right: spacing.Fourfold,
  },
});
