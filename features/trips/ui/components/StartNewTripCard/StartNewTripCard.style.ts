import { fontFamily, fontSize, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: spacing.Triple,
  },
  title: {
    fontFamily: fontFamily.interMedium,
    fontSize: fontSize.XL2,
  },
  button: {
    width: '60%',
  },
});
