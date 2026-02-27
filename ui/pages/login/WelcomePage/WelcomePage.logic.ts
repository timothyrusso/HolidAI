import { Routes } from '@/modules/navigation/domain/entities/routes';
import { useRouter } from 'expo-router';

export const useWelcomePageLogic = () => {
  const router = useRouter();

  const handlePress = () => router.push(`/${Routes.SignIn}`);

  const welcomePageImage = require('../../../assets/images/welcome_intro.jpg');

  return { handlePress, welcomePageImage };
};
