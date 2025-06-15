import { colors } from '@/ui/constants/style/colors';
import { components } from '@/ui/constants/style/dimensions/components';
import { SCREEN_HEIGHT, SCREEN_WIDTH, spacing } from '@/ui/constants/style/dimensions/spacing';
import { fonts } from '@/ui/constants/style/fonts';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  button: {
    alignSelf: 'center',
    width: components.customButtonWidth,
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.interBold,
    paddingHorizontal: spacing.Triple,
    fontSize: spacing.Quintuple,
    textAlign: 'center',
    lineHeight: spacing.Quintuple + spacing.Double,
  },
  peopleText: {
    color: colors.primary,
    borderWidth: 2,
    borderColor: colors.secondaryPink,
    padding: 0,
    margin: 0,
    borderRadius: spacing.Triple,
  },
  subtitle: {
    fontFamily: fonts.interMedium,
    paddingHorizontal: spacing.Triple,
    fontSize: spacing.Double + spacing.Minimal,
    textAlign: 'center',
    color: colors.primaryGrey,
  },
  illustrationContainer: {
    position: 'absolute',
    top: -(SCREEN_WIDTH / 2),
  },
  contentContainer: {
    width: '100%',
    height: SCREEN_HEIGHT / 2,
    justifyContent: 'center',
    rowGap: spacing.Fourfold,
  },
});
