import { colors, fontFamily, fontSize, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  detailsContainer: {
    position: 'absolute',
    bottom: spacing.Fourfold,
    left: spacing.Fourfold,
    right: spacing.Fourfold,
    borderRadius: spacing.Fourfold,
    overflow: 'hidden',
    padding: spacing.Fourfold,
    flexDirection: 'row',
    columnGap: spacing.Minimal,
  },
  androidWrapper: {
    position: 'absolute',
    bottom: spacing.Fourfold,
    left: spacing.Fourfold,
    right: spacing.Fourfold,
  },
  androidBlur: {
    flex: 1,
    padding: spacing.Fourfold,
    flexDirection: 'row',
    columnGap: spacing.Minimal,
  },
  mask: {
    flex: 1,
    borderRadius: spacing.Fourfold,
    backgroundColor: 'black',
  },
  title: {
    color: colors.primaryWhite,
    fontFamily: fontFamily.interBold,
    fontSize: fontSize.LG,
    alignSelf: 'flex-start',
  },
  location: {
    color: colors.primaryWhite,
    fontFamily: fontFamily.interBold,
    fontSize: fontSize.XL4,
    alignSelf: 'flex-start',
  },
  date: {
    color: colors.primaryWhite,
    fontFamily: fontFamily.interBold,
    fontSize: fontSize.LG,
  },
  labelDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.Single,
  },
  buttonsText: {
    fontSize: fontSize.SM,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    rowGap: spacing.Double,
  },
  footerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleButton: {
    maxWidth: '50%',
  },
  footerButton: {
    maxWidth: '50%',
  },
});
