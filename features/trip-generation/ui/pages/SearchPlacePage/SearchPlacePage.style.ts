import { components } from '@/ui/style/dimensions/components';
import { fontSize } from '@/ui/style/dimensions/fontSize';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  title: {
    fontFamily: fontFamily.interBold,
    fontSize: fontSize.XL2,
  },
  subtitle: {
    marginVertical: spacing.Fourfold,
    fontSize: fontSize.LG,
    fontFamily: fontFamily.interMedium,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.Fourfold,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchContainer: {
    flex: 1,
    position: 'relative',
    width: '100%',
    paddingHorizontal: spacing.Fourfold,
  },
  autoCompleteContainer: {
    flex: 1,
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    left: spacing.Fourfold,
    top: spacing.Double,
  },
  animation: {
    width: '100%',
    height: components.searchAnimationHeight,
  },
  animationContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
});
