import type { CSSAnimationKeyframes } from 'react-native-reanimated';

export const heartPulse: CSSAnimationKeyframes = {
  '0%': { transform: [{ scale: 1 }, { rotate: '0deg' }] },
  '25%': { transform: [{ scale: 1.3 }, { rotate: '-15deg' }] },
  '50%': { transform: [{ scale: 1.4 }, { rotate: '0deg' }] },
  '75%': { transform: [{ scale: 1.3 }, { rotate: '15deg' }] },
  '100%': { transform: [{ scale: 1 }, { rotate: '0deg' }] },
};

// Each word covers ~12.5% of the cycle (100 / 8 words), loops forever
export const wordKeyframes: CSSAnimationKeyframes[] = [
  { '0%': { opacity: 1 }, '12%': { opacity: 1 }, '13%': { opacity: 0 }, '100%': { opacity: 0 } },
  {
    '0%': { opacity: 0 },
    '12%': { opacity: 0 },
    '13%': { opacity: 1 },
    '25%': { opacity: 1 },
    '26%': { opacity: 0 },
    '100%': { opacity: 0 },
  },
  {
    '0%': { opacity: 0 },
    '25%': { opacity: 0 },
    '26%': { opacity: 1 },
    '37%': { opacity: 1 },
    '38%': { opacity: 0 },
    '100%': { opacity: 0 },
  },
  {
    '0%': { opacity: 0 },
    '37%': { opacity: 0 },
    '38%': { opacity: 1 },
    '50%': { opacity: 1 },
    '51%': { opacity: 0 },
    '100%': { opacity: 0 },
  },
  {
    '0%': { opacity: 0 },
    '50%': { opacity: 0 },
    '51%': { opacity: 1 },
    '62%': { opacity: 1 },
    '63%': { opacity: 0 },
    '100%': { opacity: 0 },
  },
  {
    '0%': { opacity: 0 },
    '62%': { opacity: 0 },
    '63%': { opacity: 1 },
    '75%': { opacity: 1 },
    '76%': { opacity: 0 },
    '100%': { opacity: 0 },
  },
  {
    '0%': { opacity: 0 },
    '75%': { opacity: 0 },
    '76%': { opacity: 1 },
    '87%': { opacity: 1 },
    '88%': { opacity: 0 },
    '100%': { opacity: 0 },
  },
  { '0%': { opacity: 0 }, '87%': { opacity: 0 }, '88%': { opacity: 1 }, '99%': { opacity: 1 }, '100%': { opacity: 0 } },
];

// Each color layer pulses from faint to full opacity — staggered phases create the blended mix
export const colorBgPulse: CSSAnimationKeyframes = {
  '0%': { opacity: 0.15 },
  '50%': { opacity: 1 },
  '100%': { opacity: 0.15 },
};

export const rotate: CSSAnimationKeyframes = {
  '0%': { transform: [{ rotateY: '0deg' }] },
  '100%': { transform: [{ rotateY: '180deg' }] },
};
