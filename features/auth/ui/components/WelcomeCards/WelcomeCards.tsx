import { WelcomeCard } from '@/features/auth/ui/components/WelcomeCard/WelcomeCard';
import { useWelcomeCardsLogic } from '@/features/auth/ui/components/WelcomeCards/WelcomeCards.logic';

export const WelcomeCards = () => {
  const { image1, image2, image3, image4, image5, image6 } = useWelcomeCardsLogic();

  return (
    <>
      <WelcomeCard
        image={image1}
        size="small"
        withPadding={false}
        withBorderRadius={true}
        rotation={-10}
        top={100}
        left={0}
        floatDuration={1000}
      />
      <WelcomeCard
        image={image2}
        size="medium"
        withPadding={true}
        withBorderRadius={true}
        rotation={5}
        top={150}
        right={0}
        floatDuration={1500}
      />
      <WelcomeCard
        image={image3}
        size="large"
        withPadding={true}
        withBorderRadius={false}
        rotation={10}
        top={300}
        left={20}
        floatDuration={2000}
        photoEffect={true}
      />
      <WelcomeCard
        image={image4}
        size="medium"
        withPadding={false}
        withBorderRadius={true}
        rotation={-7}
        top={180}
        left={100}
        floatDuration={1700}
      />
      <WelcomeCard
        image={image5}
        size="medium"
        withPadding={false}
        withBorderRadius={true}
        rotation={-16}
        top={350}
        right={0}
        floatDuration={2200}
      />
      <WelcomeCard
        image={image6}
        size="medium"
        withPadding={false}
        withBorderRadius={false}
        rotation={10}
        top={0}
        right={100}
        floatDuration={1850}
      />
    </>
  );
};
