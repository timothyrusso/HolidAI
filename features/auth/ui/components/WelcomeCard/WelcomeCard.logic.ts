import { styles } from '@/features/auth/ui/components/WelcomeCard/WelcomeCard.style';
import { components } from '@/ui/style/dimensions/components';
import { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { match } from 'ts-pattern';

const FLOAT_AMPLITUDE = 6;

export const useWelcomeCardLogic = (
  size: 'small' | 'medium' | 'large',
  withPadding: boolean,
  withBorderRadius: boolean,
  rotation: number,
  top: number | undefined,
  left: number | undefined,
  bottom: number | undefined,
  right: number | undefined,
  floatDuration: number,
  photoEffect: boolean,
) => {
  const height = () =>
    match(size)
      .with('small', () => components.welcomeCardHeightSmall)
      .with('medium', () => components.welcomeCardHeightMedium)
      .with('large', () => components.welcomeCardHeightLarge)
      .exhaustive();

  const width = () =>
    match(size)
      .with('small', () => components.welcomeCardWidthSmall)
      .with('medium', () => components.welcomeCardWidthMedium)
      .with('large', () => components.welcomeCardWidthLarge)
      .exhaustive();

  const translateY = useSharedValue(0);
  translateY.value = withRepeat(
    withTiming(-FLOAT_AMPLITUDE, { duration: floatDuration, easing: Easing.inOut(Easing.sin) }),
    -1,
    true,
  );

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation}deg` }, { translateY: translateY.value }],
  }));

  const cardStyle = styles(height(), width(), withPadding, withBorderRadius, top, left, bottom, right, photoEffect);

  return {
    cardStyle,
    floatStyle,
  };
};
