import { colors, fontFamily, fontSize, spacing } from '@/features/core/ui';
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
    fontSize: fontSize.LG,
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
    fontSize: fontSize.LG,
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
    fontSize: fontSize.SM,
    fontFamily: fontFamily.interMedium,
  },
  bestTimeToVisitValue: {
    fontSize: fontSize.SM,
    fontFamily: fontFamily.interBold,
  },
  ticketPricingContainer: {
    gap: spacing.Single,
  },
  ticketPricingValue: {
    fontSize: fontSize.SM,
    fontFamily: fontFamily.interBold,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  ticketPricingTitle: {
    fontSize: fontSize.SM,
    fontFamily: fontFamily.interMedium,
  },
  priceAlert: {
    fontSize: fontSize.XS,
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
