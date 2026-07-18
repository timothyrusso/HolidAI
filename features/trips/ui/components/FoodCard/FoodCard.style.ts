import { StyleSheet } from 'react-native';
import { colors, fontFamily, fontSize, opacity, spacing } from '@/features/core/ui';

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
    fontFamily: fontFamily.interBold,
    fontSize: fontSize.MD,
  },
  subtitle: {
    color: colors.primaryGrey,
    fontFamily: fontFamily.interMedium,
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
    fontFamily: fontFamily.interMedium,
    color: colors.primaryBlack,
    paddingHorizontal: spacing.Quintuple + spacing.Minimal,
  },
  contentContainer: {
    paddingBottom: spacing.Double,
  },
  button: {
    backgroundColor: colors.secondaryGreen,
    borderRadius: spacing.Double,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: spacing.Double,
    paddingHorizontal: spacing.Double,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.Single,
  },
  typicalDishesBox: {
    padding: spacing.Double,
    backgroundColor: colors.secondaryGrey,
    borderRadius: spacing.Double,
    marginTop: spacing.Double,
    marginHorizontal: spacing.Double,
  },
  pressed: {
    opacity: opacity.opacity60,
  },
  boxText: {
    fontFamily: fontFamily.interMedium,
    color: colors.primaryBlack,
  },
  boxButton: {
    marginTop: spacing.Single,
    fontFamily: fontFamily.interBold,
    alignSelf: 'flex-end',
    backgroundColor: colors.primaryWhite,
    padding: spacing.Single,
    borderRadius: spacing.Double,
  },
});
