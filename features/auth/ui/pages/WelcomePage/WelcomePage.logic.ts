import { navigationService } from '@/features/core/navigation';

const welcomePageImage = require('@/ui/assets/images/welcome_intro.jpg');

export const useWelcomePageLogic = () => {
  const handlePress = () => navigationService.toSignIn();

  return { handlePress, welcomePageImage };
};
