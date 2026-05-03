import { colors } from '@/ui/style/colors';
import { components } from '@/ui/style/dimensions/components';
import { fontSize } from '@/ui/style/dimensions/fontSize';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
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
    fontSize: fontSize.XL5,
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.LG,
    fontFamily: fontFamily.interRegular,
    color: colors.primaryGrey,
  },
  description: {
    fontSize: fontSize.XL2,
    fontFamily: fontFamily.interBold,
  },
  image: {
    width: '100%',
  },
});
