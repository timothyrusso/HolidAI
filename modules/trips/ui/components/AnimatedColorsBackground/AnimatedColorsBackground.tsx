import { colorBgPulse } from '@/ui/style/animations';
import Animated from 'react-native-reanimated';
import { styles } from './AnimatedColorsBackground.style';

const COLORS = ['#fa7f7c', '#b58df1', '#ffe780', '#82cab2', '#87cce8'];
const BORDER_CYCLE = 1000;

export const AnimatedColorsBackground = () => {
  return COLORS.map((color, i) => (
    <Animated.View
      key={color}
      style={[
        styles.colorBackground,
        {
          backgroundColor: color,
          animationName: colorBgPulse,
          animationDuration: BORDER_CYCLE,
          animationDelay: -(BORDER_CYCLE * i) / COLORS.length,
          animationIterationCount: 'infinite',
        },
      ]}
    />
  ));
};
