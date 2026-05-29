import { fontFamily, fontSize, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.Single,
  },
  location: {
    fontSize: fontSize.XL,
    fontFamily: fontFamily.interRegular,
  },
});
