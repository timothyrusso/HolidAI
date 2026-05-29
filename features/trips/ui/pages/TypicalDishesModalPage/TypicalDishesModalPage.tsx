import { ModalTemplate } from '@/features/core/ui';
import { useTypicalDishesModalPageLogic } from '@/features/trips/ui/pages/TypicalDishesModalPage/TypicalDishesModalPage.logic';
import { styles } from '@/features/trips/ui/pages/TypicalDishesModalPage/TypicalDishesModalPage.style';

export const TypicalDishesModalPage = () => {
  const { handleClose } = useTypicalDishesModalPageLogic();

  return (
    <ModalTemplate style={styles.container}>
      <ModalTemplate.Header title="MY_TRIP.TYPICAL_DISHES" action={handleClose} />
      <ModalTemplate.Body />
    </ModalTemplate>
  );
};
