import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  separator: {
    height: spacing.separator40,
    width: spacing.MinimalDouble,
    backgroundColor: colors.primary,
    alignSelf: 'center',
  },
  container: {
    width: '100%',
    paddingHorizontal: spacing.Fourfold,
    zIndex: 2,
  },
  list: {
    width: '100%',
    flex: 1,
  },
});
