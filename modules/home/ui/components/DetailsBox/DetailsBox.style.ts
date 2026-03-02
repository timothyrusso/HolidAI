import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fonts } from '@/ui/style/fonts';
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
    fontFamily: fonts.interBold,
    fontSize: spacing.Triple,
    alignSelf: 'flex-start',
  },
  location: {
    color: colors.primaryWhite,
    fontFamily: fonts.interBold,
    fontSize: spacing.Quintuple + spacing.Single,
    alignSelf: 'flex-start',
  },
  labelContainer: {
    alignItems: 'center',
    columnGap: spacing.Single,
    rowGap: spacing.Fourfold,
    width: '100%',
    flex: 1.7,
  },
  date: {
    color: colors.primaryWhite,
    fontFamily: fonts.interBold,
    fontSize: spacing.Triple,
    alignSelf: 'flex-start',
  },
  labelDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.Single,
  },
  buttonsContainer: {
    justifyContent: 'space-between',
    gap: spacing.Double,
    alignItems: 'flex-end',
    flex: 1.3,
  },
  buttonsText: {
    fontSize: spacing.Double,
  },
});
