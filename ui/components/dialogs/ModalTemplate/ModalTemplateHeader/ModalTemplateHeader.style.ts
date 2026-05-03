import { fontSize } from '@/ui/style/dimensions/fontSize';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: spacing.Quintuple,
    paddingVertical: spacing.Fourfold,
  },
  actionContainer: {
    width: '100%',
    marginBottom: spacing.SingleAndHalf,
  },
  title: {
    textAlign: 'center',
    fontFamily: fontFamily.interMedium,
    fontSize: fontSize.XL2,
  },
  cancelIcon: {
    alignSelf: 'flex-end',
  },
});
