import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  image: {
    width: '100%',
    flex: 1,
    resizeMode: 'cover',
  },
  detailsBox: {
    marginBottom: spacing.separator80 + spacing.Double,
  },
  skeleton: {
    width: '100%',
    flex: 1,
  },
});
