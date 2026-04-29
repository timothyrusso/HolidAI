import { colors } from '@/ui/style/colors';
import { components } from '@/ui/style/dimensions/components';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
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
    fontSize: spacing.Triple,
    fontFamily: fontFamily.interBold,
    color: colors.primaryBlack,
    marginBottom: spacing.Single,
  },
  calloutDescription: {
    fontSize: spacing.Double,
    fontFamily: fontFamily.interRegular,
    color: colors.primaryGrey,
    marginBottom: spacing.Double,
  },
  calloutButton: {
    fontSize: spacing.Double,
    fontFamily: fontFamily.interMedium,
    color: colors.primary,
    textAlign: 'center',
  },
});
