import { colors, components, fontFamily, fontSize, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  callout: {
    width: components.mapCalloutWidth,
  },
  calloutContent: {
    padding: spacing.Double,
    backgroundColor: colors.primaryWhite,
    borderRadius: spacing.Triple,
  },
  calloutTitle: {
    fontSize: fontSize.LG,
    fontFamily: fontFamily.interBold,
    color: colors.primaryBlack,
    marginBottom: spacing.Single,
  },
  calloutDescription: {
    fontSize: fontSize.SM,
    fontFamily: fontFamily.interRegular,
    color: colors.primaryGrey,
    marginBottom: spacing.Double,
  },
  calloutButton: {
    fontSize: fontSize.SM,
    fontFamily: fontFamily.interMedium,
    color: colors.primary,
    textAlign: 'center',
  },
});
