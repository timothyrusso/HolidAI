import { StyleSheet } from 'react-native';

import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.primaryWhite,
  },
  childrenContainer: {
    marginBottom: spacing.Fourfold,
  },
  basicView: {
    width: '100%',
    flex: 1,
  },
  basicScrollView: {
    width: '100%',
    flex: 1,
  },
  basicContentStyle: {
    flexGrow: 1,
  },
});
