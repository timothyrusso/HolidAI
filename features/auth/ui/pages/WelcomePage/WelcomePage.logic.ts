import { navigationService } from '@/features/core/navigation';

const welcomePageImage = require('@/ui/assets/images/welcome_intro.jpg');
const logoRound = require('@/ui/assets/images/logo_round.png');

export const useWelcomePageLogic = () => {
  const handlePress = () => navigationService.toSignIn();

  return { handlePress, welcomePageImage, logoRound };
};
