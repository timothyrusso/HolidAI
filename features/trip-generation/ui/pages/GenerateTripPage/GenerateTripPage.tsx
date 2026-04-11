import { logger } from '@/features/core/error';
import { Routes } from '@/features/core/navigation';
import { AnimatedBlocks } from '@/features/trips/ui/components/AnimatedBlocks/AnimatedBlocks';
import { AnimatedColorsBackground } from '@/features/trips/ui/components/AnimatedColorsBackground/AnimatedColorsBackground';
import { WordsAnimation } from '@/features/trips/ui/components/WordsAnimation/WordsAnimation';
import LottieAnimation from '@/ui/components/basic/LottieAnimation/LottieAnimation';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { View } from 'react-native';
import { useGenerateTripPageLogic } from './GenerateTripPage.logic';
import { style } from './GenerateTripPage.style';

const animation = require('@/ui/assets/lottie/loading_animation.json');

const GenerateTripPage = () => {
  const { isLoading } = useGenerateTripPageLogic();

  // TODO: Remove this after testing
  logger.log('isLoading', isLoading);

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
