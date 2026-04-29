import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
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
  title: {
    color: colors.primaryWhite,
    fontFamily: fontFamily.interBold,
    fontSize: spacing.Triple,
    alignSelf: 'flex-start',
  },
  location: {
    color: colors.primaryWhite,
    fontFamily: fontFamily.interBold,
    fontSize: spacing.Quintuple,
    alignSelf: 'flex-start',
  },
  date: {
    color: colors.primaryWhite,
    fontFamily: fontFamily.interBold,
    fontSize: spacing.Triple,
  },
  labelDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.Single,
  },
  buttonsText: {
    fontSize: spacing.Double,
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
