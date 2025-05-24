import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { fonts } from '@/ui/constants/style/fonts';
import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: spacing.Fourfold,
    borderWidth: 1,
    borderColor: colors.secondaryGrey,
  },
  button: {
    padding: spacing.Fourfold,
    width: '100%',
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.secondaryGrey,
  },
  pressed: {
    backgroundColor: colors.secondaryGrey,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.Double,
  },
  title: {
    fontSize: spacing.Double + spacing.Minimal,
    fontFamily: fonts.interMedium,
  },
});
