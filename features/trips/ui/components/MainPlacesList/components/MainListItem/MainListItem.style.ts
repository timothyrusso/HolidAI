import { colors } from '@/ui/style/colors';
import { fontSize } from '@/ui/style/dimensions/fontSize';
import { spacing } from '@/ui/style/dimensions/spacing';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  image: {
    width: spacing.separator40,
    height: spacing.separator40,
    borderRadius: spacing.separator40,
    borderWidth: 1.5,
    borderColor: colors.primaryBlack,
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
    fontSize: fontSize.XL4,
    fontWeight: 'bold',
  },
  skeleton: {
    width: spacing.separator40,
    height: spacing.separator40,
    borderRadius: spacing.separator40,
    marginRight: -spacing.Double,
  },
});
