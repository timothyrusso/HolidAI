import type { TypicalDish } from '@/features/trips/domain/entities/TypicalDish';
import { DishItem } from '@/features/trips/ui/components/FoodCard/components/DishItem/DishItem';
import { styles } from '@/features/trips/ui/components/TypicalDishesList/TypicalDishesList.style';
import type { FC } from 'react';
import { Fragment } from 'react';
import { View } from 'react-native';

type TypicalDishesListProps = {
  dishItems: TypicalDish[] | undefined;
};

const Separator = () => <View style={styles.separator} />;

export const TypicalDishesList: FC<TypicalDishesListProps> = ({ dishItems }) => (
  <>
    {dishItems?.map((item, index) => (
      <Fragment key={item.name}>
        {index > 0 && <Separator />}
        <DishItem dish={item} />
      </Fragment>
    ))}
  </>
);
