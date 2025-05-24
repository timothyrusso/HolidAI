import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { fonts } from '@/ui/constants/style/fonts';
import { opacity } from '@/ui/constants/style/opacity';
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
    fontSize: spacing.Double,
    fontFamily: fonts.interMedium,
    textAlign: 'center',
    maxWidth: '60%',
    paddingBottom: spacing.Quintuple,
  },
  userDataValue: {
    fontSize: spacing.Double,
    fontFamily: fonts.interBold,
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
