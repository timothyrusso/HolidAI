import { rotate } from '@/ui/style/animations';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { styles } from './AnimatedBlocks.style';

const COLORS = ['#fa7f7c', '#b58df1', '#ffe780', '#82cab2', '#87cce8'];
const BOXES_ANIMATION_DURATION = 300;

export const AnimatedBlocks = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {COLORS.map((color, id) => (
          <Animated.View
            key={color}
            style={[
              styles.box,
              {
                backgroundColor: color,
                animationName: rotate,
                animationDuration: BOXES_ANIMATION_DURATION * id + BOXES_ANIMATION_DURATION,
                animationIterationCount: 'infinite',
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};
