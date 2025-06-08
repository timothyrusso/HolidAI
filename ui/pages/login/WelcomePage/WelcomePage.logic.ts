import { Routes } from '@/ui/constants/navigation/routes';
import { useRouter } from 'expo-router';

export const useWelcomePageLogic = () => {
  const router = useRouter();
  const animation = require('../../../assets/lottie/travel_animation.json');

  const welcomeTextBackground = require('../../../assets/images/welcome_text_background.jpg');

  const handlePress = () => router.push(`/${Routes.SignIn}`);
  return { handlePress, animation, welcomeTextBackground };
};
