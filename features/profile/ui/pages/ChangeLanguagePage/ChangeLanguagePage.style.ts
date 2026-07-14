import { StyleSheet } from 'react-native';
import { spacing } from '@/features/core/ui';

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
