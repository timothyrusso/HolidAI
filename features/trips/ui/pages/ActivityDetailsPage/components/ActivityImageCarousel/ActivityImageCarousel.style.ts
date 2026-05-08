import { components } from '@/ui/style/dimensions/components';
import { spacing } from '@/ui/style/dimensions/spacing';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: spacing.TripleAndHalf,
    marginBottom: spacing.Fourfold,
  },
  contentContainer: {
    paddingHorizontal: spacing.Fourfold,
    gap: spacing.Fourfold,
  },
  image: {
    width: components.carouselImageSize,
    height: components.carouselImageSize,
    borderRadius: spacing.Double,
  },
});
