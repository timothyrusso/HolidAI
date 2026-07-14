import { StyleSheet } from 'react-native';
import { components, spacing } from '@/features/core/ui';

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
