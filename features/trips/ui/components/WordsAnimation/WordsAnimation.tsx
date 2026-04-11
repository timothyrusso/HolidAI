import { wordKeyframes } from '@/ui/style/animations';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { styles } from './WordsAnimation.style';

const LOADING_WORDS = ['discovering', 'exploring', 'mapping', 'wandering', 'dreaming', 'your', 'perfect', 'journey'];
const WORDS_ANIMATION_DURATION = 10000;

export const WordsAnimation = () => {
  return (
    <View style={styles.wordContainer}>
      {LOADING_WORDS.map((word, i) => (
        <Animated.View
          key={word}
          style={[
            styles.wordWrapper,
            {
              animationName: wordKeyframes[i],
              animationDuration: WORDS_ANIMATION_DURATION,
              animationIterationCount: 'infinite',
            },
          ]}
        >
          <Text style={styles.loadingWord}>{word}</Text>
        </Animated.View>
      ))}
    </View>
  );
};
