import { spacing } from '@/ui/style/dimensions/spacing';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: spacing.separator120 + spacing.Quintuple,
    zIndex: 2,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.Triple,
  },
  box: {
    width: spacing.Triple + spacing.Minimal,
    height: spacing.TripleAndHalf + spacing.Minimal,
    marginVertical: spacing.Single,
  },
});
