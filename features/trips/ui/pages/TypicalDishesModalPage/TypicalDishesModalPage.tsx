import { ModalTemplate } from '@/features/core/ui';
import { DishItem } from '@/features/trips/ui/components/FoodCard/components/DishItem/DishItem';
import { TypicalDishesHeader } from '@/features/trips/ui/components/TypicalDishesHeader/TypicalDishesHeader';
import { useTypicalDishesModalPageLogic } from '@/features/trips/ui/pages/TypicalDishesModalPage/TypicalDishesModalPage.logic';
import { styles } from '@/features/trips/ui/pages/TypicalDishesModalPage/TypicalDishesModalPage.style';
import { FlatList, View } from 'react-native';

const Separator = () => <View style={styles.separator} />;

export const TypicalDishesModalPage = () => {
  const { handleClose, location, dishNumber, dishItems } = useTypicalDishesModalPageLogic();

  return (
    <ModalTemplate style={styles.container}>
      <ModalTemplate.Header title="MY_TRIP.TYPICAL_DISHES" action={handleClose}>
        <TypicalDishesHeader location={location} dishNumber={dishNumber} />
      </ModalTemplate.Header>
      <ModalTemplate.Body>
        <FlatList
          data={dishItems}
          renderItem={({ item }) => <DishItem dish={item} />}
          keyExtractor={item => item.name}
          contentContainerStyle={styles.contentContainer}
          style={styles.list}
          ItemSeparatorComponent={Separator}
        />
      </ModalTemplate.Body>
    </ModalTemplate>
  );
};
