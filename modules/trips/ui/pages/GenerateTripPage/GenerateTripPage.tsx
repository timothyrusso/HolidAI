import { logger } from '@/di/resolve';
import { Routes } from '@/modules/navigation/domain/entities/routes';
import LottieAnimation from '@/ui/components/basic/LottieAnimation/LottieAnimation';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { colorBgPulse, rotate, wordKeyframes } from '@/ui/style/animations';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useGenerateTripPageLogic } from './GenerateTripPage.logic';
import { style } from './GenerateTripPage.style';

const LOADING_WORDS = ['discovering', 'exploring', 'mapping', 'wandering', 'dreaming', 'your', 'perfect', 'journey'];
const COLORS = ['#fa7f7c', '#b58df1', '#ffe780', '#82cab2', '#87cce8'];
const BORDER_CYCLE = 1000;
const BOXES_ANIMATION_DURATION = 300;
const WORDS_ANIMATION_DURATION = 10000;

const GenerateTripPage = () => {
  const animation = require('@/ui/assets/lottie/loading_animation.json');
  const { generateAiTrip } = useGenerateTripPageLogic();

  logger.log(generateAiTrip);

  return (
    <BasicView nameView={Routes.GenerateTrip} statusBarStyle="dark">
      {/* Layer 1: 5 full-screen color layers covering the entire background including corners */}
      {COLORS.map((color, i) => (
        <Animated.View
          key={color}
          style={[
            style.colorBackground,
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

      {/* Layer 2: white mask inset by BORDER_SIZE with rounded corners — creates the inner rounded edge */}
      <View style={style.innerMask} />

      {/* Layer 3: content on top */}
      <View style={style.animationContainer}>
        <View style={style.wordContainer}>
          {LOADING_WORDS.map((word, i) => (
            <Animated.View
              key={word}
              style={[
                style.wordWrapper,
                {
                  animationName: wordKeyframes[i],
                  animationDuration: WORDS_ANIMATION_DURATION,
                  animationIterationCount: 'infinite',
                },
              ]}
            >
              <Text style={style.loadingWord}>{word}</Text>
            </Animated.View>
          ))}
        </View>
        <View style={style.container}>
          <View style={style.row}>
            {COLORS.map((color, id) => (
              <Animated.View
                key={color}
                style={[
                  style.box,
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
        <LottieAnimation animationPath={animation} style={style.animation} />
      </View>
    </BasicView>
  );
};

export default GenerateTripPage;
