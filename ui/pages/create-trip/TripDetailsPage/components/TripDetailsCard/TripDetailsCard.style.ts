import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { fonts } from '@/ui/constants/style/fonts';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: spacing.Fourfold,
    borderRadius: spacing.Triple,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.secondaryGrey,
  },
  header: {
    position: 'relative',
    padding: spacing.Double,
    rowGap: spacing.Single,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerText: {
    color: colors.primaryWhite,
    fontFamily: fonts.interBold,
    fontSize: spacing.Double + spacing.Minimal,
  },
  subtitle: {
    color: colors.primaryGrey,
    fontFamily: fonts.interMedium,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.Single,
    paddingHorizontal: spacing.Double,
    paddingTop: spacing.Double,
    paddingBottom: spacing.MinimalDouble,
  },
  contentValue: {
    fontFamily: fonts.interMedium,
    color: colors.primaryBlack,
    paddingHorizontal: spacing.Quintuple + spacing.Minimal,
  },
  budgetValue: {
    fontFamily: fonts.interMedium,
    color: colors.primaryBlack,
    backgroundColor: colors.primaryGreen,
    borderWidth: 1,
    borderRadius: spacing.Triple,
    alignSelf: 'flex-start',
    marginLeft: spacing.Quintuple,
    paddingHorizontal: spacing.Single,
    paddingVertical: spacing.Minimal,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  columnContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.Double,
  },
  headerChipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.Single,
    paddingHorizontal: spacing.MinimalDouble,
    paddingVertical: spacing.Minimal,
    backgroundColor: colors.primaryWhite,
    borderRadius: spacing.Triple,
    alignSelf: 'flex-start',
  },
  headerChipText: {
    fontFamily: fonts.interBold,
    color: colors.primaryBlack,
    fontSize: spacing.SingleAndHalf + spacing.Minimal,
  },
});
