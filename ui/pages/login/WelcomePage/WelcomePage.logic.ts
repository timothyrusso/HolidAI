import { Routes } from '@/ui/constants/navigation/routes';
import { useRouter } from 'expo-router';

export const useWelcomePageLogic = () => {
  const router = useRouter();

  const handlePress = () => router.push(`/${Routes.SignIn}`);
  return { handlePress };
};
