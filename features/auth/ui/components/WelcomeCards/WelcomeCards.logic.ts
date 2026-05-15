import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/ui/style/dimensions/spacing';
import type { ImageProps } from 'expo-image';

type CardConfig = {
  image: ImageProps['source'];
  size: 'small' | 'medium' | 'large';
  withPadding?: boolean;
  withBorderRadius?: boolean;
  rotation?: number;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  floatDuration?: number;
  photoEffect?: boolean;
};

const cards: CardConfig[] = [
  {
    image: require('@/ui/assets/images/welcome_1.jpg'),
    size: 'small',
    withPadding: false,
    withBorderRadius: true,
    rotation: -10,
    top: Math.round(SCREEN_HEIGHT * 0.12),
    left: 0,
    floatDuration: 1000,
  },
  {
    image: require('@/ui/assets/images/welcome_2.jpg'),
    size: 'medium',
    withPadding: true,
    withBorderRadius: true,
    rotation: 5,
    top: Math.round(SCREEN_HEIGHT * 0.18),
    right: 0,
    floatDuration: 1500,
  },
  {
    image: require('@/ui/assets/images/welcome_3.jpg'),
    size: 'large',
    withPadding: true,
    withBorderRadius: false,
    rotation: 10,
    top: Math.round(SCREEN_HEIGHT * 0.36),
    left: Math.round(SCREEN_WIDTH * 0.05),
    floatDuration: 2000,
    photoEffect: true,
  },
  {
    image: require('@/ui/assets/images/welcome_4.jpg'),
    size: 'medium',
    withPadding: false,
    withBorderRadius: true,
    rotation: -7,
    top: Math.round(SCREEN_HEIGHT * 0.21),
    left: Math.round(SCREEN_WIDTH * 0.26),
    floatDuration: 1700,
  },
  {
    image: require('@/ui/assets/images/welcome_5.jpg'),
    size: 'medium',
    withPadding: false,
    withBorderRadius: true,
    rotation: -16,
    top: Math.round(SCREEN_HEIGHT * 0.41),
    right: 0,
    floatDuration: 2200,
  },
  {
    image: require('@/ui/assets/images/welcome_6.jpg'),
    size: 'medium',
    withPadding: false,
    withBorderRadius: false,
    rotation: 10,
    top: 0,
    right: Math.round(SCREEN_WIDTH * 0.26),
    floatDuration: 1850,
  },
];

export const useWelcomeCardsLogic = () => ({ cards });
