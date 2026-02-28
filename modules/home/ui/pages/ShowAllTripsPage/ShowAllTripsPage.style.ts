import { components } from '@/ui/style/dimensions/components';
import { SCREEN_WIDTH, spacing } from '@/ui/style/dimensions/spacing';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    paddingHorizontal: spacing.Triple,
    paddingVertical: spacing.separator40,
  },
  columnWrapper: {
    gap: spacing.Triple,
    paddingBottom: spacing.Triple,
  },
  skeleton: {
    width: (SCREEN_WIDTH - spacing.Triple * 3) / 2,
    height: components.tripCardImageHeight,
    borderRadius: spacing.Double,
  },
});
