import LottieView from 'lottie-react-native';
import type { StyleProp, ViewStyle } from 'react-native';

type LottieAnimationProps = {
  style: StyleProp<ViewStyle>;
  animationPath: string;
  autoPlay?: boolean;
  loop?: boolean;
};
export const LottieAnimation = ({ style, animationPath, autoPlay = true, loop = true }: LottieAnimationProps) => {
  return <LottieView source={animationPath} style={style} autoPlay={autoPlay} loop={loop} />;
};
