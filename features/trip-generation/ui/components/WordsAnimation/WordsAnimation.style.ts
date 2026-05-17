import { components, fontFamily, fontSize, spacing } from '@/features/core/ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wordContainer: {
    height: components.animatedWordsHeight,
    alignItems: 'center',
    justifyContent: 'center',
    top: spacing.separator80 + spacing.Fourfold,
    position: 'absolute',
  },
  wordWrapper: {
    position: 'absolute',
  },
  loadingWord: {
    fontSize: fontSize.XL3,
    fontFamily: fontFamily.interBold,
  },
});
