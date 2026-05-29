import { ModalTemplate } from '@/features/core/ui';
import { TypicalDishesHeader } from '@/features/trips/ui/components/TypicalDishesHeader/TypicalDishesHeader';
import { useTypicalDishesModalPageLogic } from '@/features/trips/ui/pages/TypicalDishesModalPage/TypicalDishesModalPage.logic';
import { styles } from '@/features/trips/ui/pages/TypicalDishesModalPage/TypicalDishesModalPage.style';

export const TypicalDishesModalPage = () => {
  const { handleClose, location } = useTypicalDishesModalPageLogic();

  return (
    <ModalTemplate style={styles.container}>
      <ModalTemplate.Header title="MY_TRIP.TYPICAL_DISHES" action={handleClose}>
        <TypicalDishesHeader location={location} />
      </ModalTemplate.Header>
      <ModalTemplate.Body />
    </ModalTemplate>
  );
};
