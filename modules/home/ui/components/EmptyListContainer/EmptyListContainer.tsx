import LottieAnimation from '@/ui/components/basic/LottieAnimation/LottieAnimation';
import { View } from 'react-native';
import StartNewTripCard from '../StartNewTripCard/StartNewTripCard';
import { styles } from './EmptyListContainer.style';

const animation = require('../../../../../ui/assets/lottie/trip_animation.json');

export const EmptyListContainer = () => {
  return (
    <View style={styles.container}>
      <View style={styles.newTripContainer}>
        <StartNewTripCard />
      </View>
      <LottieAnimation animationPath={animation} style={styles.animation} />
    </View>
  );
};
