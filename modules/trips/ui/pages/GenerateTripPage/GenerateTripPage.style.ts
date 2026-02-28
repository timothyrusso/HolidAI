import { components } from '@/ui/style/dimensions/components';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fonts } from '@/ui/style/fonts';
import { StyleSheet } from 'react-native';

const BORDER_SIZE = 15;

export const style = StyleSheet.create({
  // Layer 1: full-screen per-color backgrounds
  colorBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Layer 2: white mask with inner corner radius (screen_radius - border_size = 55 - 15 = 40)
  innerMask: {
    position: 'absolute',
    top: BORDER_SIZE,
    left: BORDER_SIZE,
    right: BORDER_SIZE,
    bottom: BORDER_SIZE,
    backgroundColor: 'white',
    borderRadius: spacing.separator40,
    borderCurve: 'continuous',
  },
  // Layer 3: content
  animationContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: spacing.Fourfold,
    alignItems: 'center',
  },
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
  animation: {
    flex: 1,
    width: '100%',
    height: components.tripAnimationHeight,
    paddingHorizontal: spacing.Fourfold,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: spacing.separator120 + spacing.Quintuple,
    zIndex: 2,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.Triple,
  },
  box: {
    width: spacing.Triple + spacing.Minimal,
    height: spacing.TripleAndHalf + spacing.Minimal,
    marginVertical: spacing.Single,
  },
});
