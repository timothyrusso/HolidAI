import { logger } from '@/di/resolve';
import { Routes } from '@/modules/navigation/domain/entities/routes';
import LottieAnimation from '@/ui/components/basic/LottieAnimation/LottieAnimation';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { View } from 'react-native';
import { AnimatedBlocks } from '../../components/AnimatedBlocks/AnimatedBlocks';
import { AnimatedColorsBackground } from '../../components/AnimatedColorsBackground/AnimatedColorsBackground';
import { WordsAnimation } from '../../components/WordsAnimation/WordsAnimation';
import { useGenerateTripPageLogic } from './GenerateTripPage.logic';
import { style } from './GenerateTripPage.style';

const GenerateTripPage = () => {
  const animation = require('@/ui/assets/lottie/loading_animation.json');
  const { generateAiTrip } = useGenerateTripPageLogic();

  logger.log(generateAiTrip);

  return (
    <BasicView nameView={Routes.GenerateTrip} statusBarStyle="dark">
      {/* Layer 1: 5 full-screen color layers covering the entire background including corners */}
      <AnimatedColorsBackground />

      {/* Layer 2: white mask inset by BORDER_SIZE with rounded corners — creates the inner rounded edge */}
      <View style={style.innerMask} />

      {/* Layer 3: content on top */}
      <View style={style.animationContainer}>
        <WordsAnimation />
        <AnimatedBlocks />
        <LottieAnimation animationPath={animation} style={style.animation} />
      </View>
    </BasicView>
  );
};

export default GenerateTripPage;
