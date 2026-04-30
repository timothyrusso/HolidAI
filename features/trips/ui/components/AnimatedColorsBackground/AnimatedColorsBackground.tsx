import { styles } from '@/features/trips/ui/components/AnimatedColorsBackground/AnimatedColorsBackground.style';
import { colorBgPulse } from '@/ui/style/animations';
import { Fragment } from 'react';
import Animated from 'react-native-reanimated';

const COLORS = ['#fa7f7c', '#b58df1', '#ffe780', '#82cab2', '#87cce8'];
const BORDER_CYCLE = 1000;

export const AnimatedColorsBackground = () => {
  return (
    <Fragment>
      {COLORS.map((color, i) => (
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
      ))}
    </Fragment>
  );
};
