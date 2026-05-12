import { Routes } from '@/features/core/navigation';
import { AnimatedBlocks } from '@/features/trip-generation/ui/components/AnimatedBlocks/AnimatedBlocks';
import { AnimatedColorsBackground } from '@/features/trip-generation/ui/components/AnimatedColorsBackground/AnimatedColorsBackground';
import { WordsAnimation } from '@/features/trip-generation/ui/components/WordsAnimation/WordsAnimation';
import { useGenerateTripPageLogic } from '@/features/trip-generation/ui/pages/GenerateTripPage/GenerateTripPage.logic';
import { style } from '@/features/trip-generation/ui/pages/GenerateTripPage/GenerateTripPage.style';
import { LottieAnimation } from '@/ui/components/basic/LottieAnimation/LottieAnimation';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { View } from 'react-native';

const animation = require('@/ui/assets/lottie/loading_animation.json');

export const GenerateTripPage = () => {
  useGenerateTripPageLogic();

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
