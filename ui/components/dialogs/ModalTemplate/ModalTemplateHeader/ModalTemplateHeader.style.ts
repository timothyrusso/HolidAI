import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { fonts } from '@/ui/constants/style/fonts';
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
    fontFamily: fonts.interMedium,
    fontSize: spacing.Fourfold,
  },
  cancelIcon: {
    alignSelf: 'flex-end',
  },
});
