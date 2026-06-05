import { colors, fontFamily, fontSize, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.Quintuple,
  },
  headerContent: {
    gap: spacing.Single,
  },
  title: {
    fontFamily: fontFamily.interExtraBold,
    fontSize: fontSize.XL2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.Single,
  },
  location: {
    fontSize: fontSize.LG,
    fontFamily: fontFamily.interRegular,
  },
  dishNumber: {
    fontSize: fontSize.SM,
    fontFamily: fontFamily.interBold,
    color: colors.primaryGrey,
  },
});
