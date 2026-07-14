import { StyleSheet } from 'react-native';
import { components, SCREEN_WIDTH, spacing } from '@/features/core/ui';

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
