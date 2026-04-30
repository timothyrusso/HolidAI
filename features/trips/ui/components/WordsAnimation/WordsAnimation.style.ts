import { components } from '@/ui/style/dimensions/components';
import { fontSize } from '@/ui/style/dimensions/fontSize';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
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
