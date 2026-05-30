import { shadows, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  detailsBox: {
    marginBottom: spacing.separator120,
    boxShadow: shadows.highShadow,
  },
  skeleton: {
    width: '100%',
    flex: 1,
  },
});
