import { spacing } from '@/ui/style/dimensions/spacing';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  separator: {
    height: spacing.TripleAndHalf,
  },
  container: {
    width: '100%',
    paddingHorizontal: spacing.Fourfold,
    paddingVertical: spacing.Double,
  },
  list: {
    width: '100%',
    flex: 1,
  },
});
