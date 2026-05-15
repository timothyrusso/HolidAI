import { WelcomeCard } from '@/features/auth/ui/components/WelcomeCard/WelcomeCard';
import { useWelcomeCardsLogic } from '@/features/auth/ui/components/WelcomeCards/WelcomeCards.logic';

export const WelcomeCards = () => {
  const { cards } = useWelcomeCardsLogic();

  return (
    <>
      {cards.map((card, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static list, never reorders
        <WelcomeCard key={index} {...card} />
      ))}
    </>
  );
};
