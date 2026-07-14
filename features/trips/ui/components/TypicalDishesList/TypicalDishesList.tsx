import type { FC } from 'react';
import { Fragment } from 'react';
import { View } from 'react-native';
import type { TypicalDish } from '@/features/trips/domain/entities/TypicalDish';
import { DishItem } from '@/features/trips/ui/components/FoodCard/components/DishItem/DishItem';
import { styles } from '@/features/trips/ui/components/TypicalDishesList/TypicalDishesList.style';

type TypicalDishesListProps = {
  dishItems: TypicalDish[] | undefined;
  onDishPress: (searchTerm: string) => void;
};

const Separator = () => <View style={styles.separator} />;

export const TypicalDishesList: FC<TypicalDishesListProps> = ({ dishItems, onDishPress }) => (
  <>
    {dishItems?.map((item, index) => (
      <Fragment key={item.searchTerm}>
        {index > 0 && <Separator />}
        <DishItem dish={item} onPress={() => onDishPress(item.searchTerm)} />
      </Fragment>
    ))}
  </>
);
