import { colors } from '@/ui/style/colors';
import { components } from '@/ui/style/dimensions/components';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fonts } from '@/ui/style/fonts';
import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: components.cardHeight,
    alignItems: 'center',
    paddingHorizontal: spacing.Double,
    columnGap: spacing.Fourfold,
    width: '100%',
  },
  textContainer: {
    flex: 1,
    rowGap: spacing.Double,
  },
  icon: {
    fontSize: spacing.separator40,
    alignItems: 'center',
  },
  title: {
    fontSize: spacing.Triple,
    fontFamily: fonts.interRegular,
    color: colors.primaryGrey,
  },
  description: {
    fontSize: spacing.Fourfold,
    fontFamily: fonts.interBold,
  },
  image: {
    width: '100%',
  },
});
