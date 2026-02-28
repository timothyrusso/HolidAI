import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  image: {
    width: spacing.separator40,
    height: spacing.separator40,
    borderRadius: spacing.separator40,
    borderWidth: 1.5,
    marginRight: -spacing.Double,
  },
  lastItem: {
    width: spacing.separator40,
    height: spacing.separator40,
    borderRadius: spacing.separator40,
    marginRight: spacing.Double,
    backgroundColor: colors.primaryWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lastItemText: {
    fontSize: spacing.Quintuple,
    fontWeight: 'bold',
  },
  skeleton: {
    width: spacing.separator40,
    height: spacing.separator40,
    borderRadius: spacing.separator40,
    marginRight: -spacing.Double,
  },
});
