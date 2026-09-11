import { View } from 'react-native';
import { BasicView, LottieAnimation } from '@/features/core/design-system';
import { Routes } from '@/features/core/navigation';
import { AnimatedBlocks } from '@/features/trip-generation/ui/components/AnimatedBlocks/AnimatedBlocks';
import { AnimatedColorsBackground } from '@/features/trip-generation/ui/components/AnimatedColorsBackground/AnimatedColorsBackground';
import { WordsAnimation } from '@/features/trip-generation/ui/components/WordsAnimation/WordsAnimation';
import { useGenerateTripPageLogic } from '@/features/trip-generation/ui/pages/GenerateTripPage/GenerateTripPage.logic';
import { style } from '@/features/trip-generation/ui/pages/GenerateTripPage/GenerateTripPage.style';

const animation = require('@/features/core/design-system/assets/lottie/loading_animation.json');

export const GenerateTripPage = () => {
  useGenerateTripPageLogic();

  return (
    <BasicView nameView={Routes.GenerateTrip} statusBarStyle="dark">
      <AnimatedColorsBackground />

      <View style={style.innerMask} />

      <View style={style.animationContainer}>
        <WordsAnimation />
        <AnimatedBlocks />
        <LottieAnimation animationPath={animation} style={style.animation} />
      </View>
    </BasicView>
  );
};
