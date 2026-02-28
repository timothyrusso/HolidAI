import { spacing } from '@/ui/style/dimensions/spacing';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: spacing.Fourfold,
    rowGap: spacing.Fourfold,
    marginTop: spacing.separator40,
  },
});
