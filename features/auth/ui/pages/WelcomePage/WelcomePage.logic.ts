import { Routes } from '@/modules/navigation/domain/entities/routes';
import { useRouter } from 'expo-router';

const welcomePageImage = require('@/ui/assets/images/welcome_intro.jpg');

export const useWelcomePageLogic = () => {
  const router = useRouter();

  const handlePress = () => router.push(`/${Routes.SignIn}`);

  return { handlePress, welcomePageImage };
};
