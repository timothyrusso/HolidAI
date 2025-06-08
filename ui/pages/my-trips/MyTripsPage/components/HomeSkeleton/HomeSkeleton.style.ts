import { colors } from '@/ui/constants/style/colors';
import { components } from '@/ui/constants/style/dimensions/components';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  box: {
    position: 'absolute',
    height: components.homeBoxSkeletonHeight,
    backgroundColor: colors.primaryGrey,
    marginBottom: spacing.separator80 + spacing.Double,
    bottom: spacing.Fourfold,
    left: spacing.Fourfold,
    right: spacing.Fourfold,
    borderRadius: spacing.Fourfold,
    justifyContent: 'flex-end',
    paddingBottom: spacing.Fourfold,
  },
  button: {
    height: components.buttonLargeHeight,
    borderRadius: spacing.Double,
    backgroundColor: colors.primaryBlack,
    width: '60%',
    alignSelf: 'center',
  },
});
