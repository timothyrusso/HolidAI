import { colors, fontFamily, fontSize, opacity, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  userDataContainer: {
    paddingVertical: spacing.Triple,
    paddingHorizontal: spacing.Double,
    borderRadius: spacing.Fourfold,
    backgroundColor: colors.primaryYellow,
    marginHorizontal: spacing.Fourfold,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userDataItem: {
    flex: 1,
    alignItems: 'center',
  },
  userDataLabel: {
    fontSize: fontSize.SM,
    fontFamily: fontFamily.interMedium,
    textAlign: 'center',
    maxWidth: '60%',
    paddingBottom: spacing.Quintuple,
  },
  userDataValue: {
    fontSize: fontSize.SM,
    fontFamily: fontFamily.interBold,
    color: colors.primaryBlack,
  },
  divider: {
    width: 1,
    backgroundColor: colors.primaryBlack,
    height: '100%',
  },
  userDataValueContainer: {
    backgroundColor: colors.primaryWhite,
    width: spacing.Fourfold,
    height: spacing.Fourfold,
    borderRadius: spacing.Fourfold,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.Double,
    position: 'absolute',
    bottom: 0,
  },
  pressed: {
    opacity: opacity.default,
  },
  capStatusContainer: {
    backgroundColor: colors.primary,
  },
  capStatusText: {
    color: colors.primaryWhite,
  },
});
