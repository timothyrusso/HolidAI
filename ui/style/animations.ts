import type { CSSAnimationKeyframes } from 'react-native-reanimated';

export const heartPulse: CSSAnimationKeyframes = {
  '0%': { transform: [{ scale: 1 }, { rotate: '0deg' }] },
  '25%': { transform: [{ scale: 1.3 }, { rotate: '-15deg' }] },
  '50%': { transform: [{ scale: 1.4 }, { rotate: '0deg' }] },
  '75%': { transform: [{ scale: 1.3 }, { rotate: '15deg' }] },
  '100%': { transform: [{ scale: 1 }, { rotate: '0deg' }] },
};
