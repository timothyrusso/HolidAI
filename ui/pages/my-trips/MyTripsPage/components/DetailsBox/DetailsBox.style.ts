import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { fonts } from '@/ui/constants/style/fonts';
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
  },
  location: {
    color: colors.primaryWhite,
    fontFamily: fonts.interBold,
    fontSize: spacing.TripleAndHalf,
    alignSelf: 'flex-start',
    paddingBottom: spacing.SingleAndHalf,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.Single,
    paddingBottom: spacing.Single,
  },
  detailsButton: {
    marginTop: spacing.Triple,
    width: '70%',
    alignSelf: 'center',
  },
  label: {
    color: colors.primaryWhite,
    fontFamily: fonts.interBold,
    fontSize: spacing.Double + spacing.Minimal,
    alignSelf: 'flex-start',
  },
  date: {
    position: 'absolute',
    top: spacing.FourfoldAndHalf + spacing.Minimal,
    right: spacing.Fourfold,
    color: colors.primaryWhite,
    fontFamily: fonts.interBold,
    fontSize: spacing.Double + spacing.Minimal,
  },
  labelDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.Single,
  },
  detailsBoxContainer: {
    rowGap: spacing.Single,
  },
});
