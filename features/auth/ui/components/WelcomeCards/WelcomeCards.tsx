import { WelcomeCard } from '@/features/auth/ui/components/WelcomeCard/WelcomeCard';
import { useWelcomeCardsLogic } from '@/features/auth/ui/components/WelcomeCards/WelcomeCards.logic';

export const WelcomeCards = () => {
  const { cards } = useWelcomeCardsLogic();

  return (
    <>
      {cards.map(card => (
        <WelcomeCard key={card.id} {...card} />
      ))}
    </>
  );
};
