import type { FC } from 'react';
import { View } from 'react-native';
import { Cheap, CustomText, colors, icons } from '@/features/core/ui';
import { styles } from '@/features/trips/ui/components/IngredientsList/IngredientsList.style';

type IngredientsListProps = {
  title: string;
  ingredients: string[];
};

export const IngredientsList: FC<IngredientsListProps> = ({ title, ingredients }) => (
  <View style={styles.container}>
    <CustomText text={title} style={styles.title} />
    <View style={styles.chipsRow}>
      {ingredients.map(ingredient => (
        <Cheap
          key={ingredient}
          title={ingredient}
          color={colors.secondaryGrey}
          icon={icons.checkmark}
          uppercase={false}
        />
      ))}
    </View>
  </View>
);
