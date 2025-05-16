import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: spacing.Sextuple + spacing.Triple,
    right: spacing.Double,
  },
  skeleton: {
    flex: 1,
    position: 'absolute',
    top: spacing.Sextuple + spacing.Triple,
    right: spacing.Fourfold,
    backgroundColor: colors.primaryBlack,
    borderRadius: spacing.Double,
    height: spacing.separator40,
    width: spacing.separator160,
  },
});
