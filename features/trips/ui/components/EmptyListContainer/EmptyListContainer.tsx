import { styles } from '@/features/trips/ui/components/EmptyListContainer/EmptyListContainer.style';
import { StartNewTripCard } from '@/features/trips/ui/components/StartNewTripCard/StartNewTripCard';
import { LottieAnimation } from '@/ui/components/basic/LottieAnimation/LottieAnimation';
import { View } from 'react-native';

const animation = require('@/ui/assets/lottie/trip_animation.json');

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
