import { TypicalDishesList } from '@/features/trips/ui/components/TypicalDishesList/TypicalDishesList';
import { TypicalDishesModalHeader } from '@/features/trips/ui/components/TypicalDishesModalHeader/TypicalDishesModalHeader';
import { useTypicalDishesModalPageLogic } from '@/features/trips/ui/pages/TypicalDishesModalPage/TypicalDishesModalPage.logic';
import { styles } from '@/features/trips/ui/pages/TypicalDishesModalPage/TypicalDishesModalPage.style';
import { ScrollView } from 'react-native';

export const TypicalDishesModalPage = () => {
  const { handleClose, location, dishNumber, dishItems } = useTypicalDishesModalPageLogic();

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
      <TypicalDishesModalHeader location={location} dishNumber={dishNumber} onClose={handleClose} />
      <TypicalDishesList dishItems={dishItems} />
    </ScrollView>
  );
};
