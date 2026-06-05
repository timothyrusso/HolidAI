import { fontSize } from '@/features/core/ui/style/dimensions/fontSize';
import { spacing } from '@/features/core/ui/style/dimensions/spacing';
import { fontFamily } from '@/features/core/ui/style/fontFamily';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.Double,
    marginBottom: spacing.Fourfold,
  },
  title: {
    fontFamily: fontFamily.interExtraBold,
    fontSize: fontSize.XL2,
    maxWidth: '90%',
  },
});
