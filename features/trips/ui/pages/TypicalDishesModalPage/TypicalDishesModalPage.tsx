import { ModalHeader } from '@/features/core/ui';
import { useTypicalDishesModalPageLogic } from '@/features/trips/ui/pages/TypicalDishesModalPage/TypicalDishesModalPage.logic';
import { styles } from '@/features/trips/ui/pages/TypicalDishesModalPage/TypicalDishesModalPage.style';
import { View } from 'react-native';

export const TypicalDishesModalPage = () => {
  const { handleClose } = useTypicalDishesModalPageLogic();

  return (
    <View style={styles.container}>
      <ModalHeader title="MY_TRIP.TYPICAL_DISHES" action={handleClose} />
    </View>
  );
};
