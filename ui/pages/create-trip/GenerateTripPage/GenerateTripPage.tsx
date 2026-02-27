import { logger } from '@/di/resolve';
import { Routes } from '@/modules/navigation/domain/entities/routes';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import LottieAnimation from '@/ui/components/basic/LottieAnimation/LottieAnimation';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { View } from 'react-native';
import { useGenerateTripPageLogic } from './GenerateTripPage.logic';
import { style } from './GenerateTripPage.style';

const GenerateTripPage = () => {
  const animation = require('../../../assets/lottie/loading_animation.json');
  const { generateAiTrip } = useGenerateTripPageLogic();

  logger.log(generateAiTrip);

  return (
    <BasicView nameView={Routes.GenerateTrip} statusBarStyle="dark">
      <CustomText text="GENERATE_TRIP.DESCRIPTION" style={style.subtitle} />
      <View style={style.animationContainer}>
        <LottieAnimation animationPath={animation} style={style.animation} />
      </View>
    </BasicView>
  );
};

export default GenerateTripPage;
