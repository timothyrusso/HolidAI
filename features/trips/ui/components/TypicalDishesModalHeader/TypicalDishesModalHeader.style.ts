import { colors, fontFamily, fontSize, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.Quintuple,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondaryGreen,
    paddingBottom: spacing.Double,
  },
  headerContent: {
    gap: spacing.Single,
  },
  title: {
    fontFamily: fontFamily.interExtraBold,
    fontSize: fontSize.XL2,
  },
});
