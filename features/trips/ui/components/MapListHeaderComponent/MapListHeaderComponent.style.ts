import { components, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mapContainer: {
    height: components.mapHeight,
    marginHorizontal: spacing.Fourfold,
    borderRadius: spacing.Triple,
    overflow: 'hidden',
  },
  map: {
    height: '100%',
    width: '100%',
  },
});
