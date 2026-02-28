import { components } from '@/ui/style/dimensions/components';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fonts } from '@/ui/style/fonts';
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
    fontSize: spacing.FourfoldAndHalf,
    fontFamily: fonts.interBold,
  },
});
