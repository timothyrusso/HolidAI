import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  backIcon: {
    position: 'absolute',
    zIndex: spacing.Minimal,
    left: spacing.Fourfold,
    top: spacing.TripleAndHalf + spacing.separator40,
  },
  favoriteIcon: {
    position: 'absolute',
    zIndex: spacing.Minimal,
    right: spacing.Fourfold,
    top: spacing.TripleAndHalf + spacing.separator40,
  },
  removeIcon: {
    position: 'absolute',
    zIndex: spacing.Minimal,
    right: spacing.Quintuple + spacing.Sextuple,
    top: spacing.TripleAndHalf + spacing.separator40,
  },
});
