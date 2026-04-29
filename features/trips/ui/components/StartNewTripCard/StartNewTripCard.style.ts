import { spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: spacing.Triple,
  },
  title: {
    fontFamily: fontFamily.interMedium,
    fontSize: spacing.Fourfold,
  },
  button: {
    width: '60%',
  },
});
