import { CustomButtonSmall, CustomIcon, CustomText, colors, icons, spacing } from '@/features/core/ui';
import type { Food } from '@/features/trips/domain/entities/Food';
import { useFoodCardLogic } from '@/features/trips/ui/components/FoodCard/FoodCard.logic';
import { styles } from '@/features/trips/ui/components/FoodCard/FoodCard.style';
import { DishItem } from '@/features/trips/ui/components/FoodCard/components/DishItem/DishItem';
import { LinearGradient } from 'expo-linear-gradient';
import type { FC } from 'react';
import { FlatList, View } from 'react-native';

type FoodCardProps = {
  food: Food;
};

export const FoodCard: FC<FoodCardProps> = ({ food }) => {
  const { dishItems, handleOpenModal } = useFoodCardLogic(food);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LinearGradient
          colors={[colors.secondaryGreen, colors.primaryGreen]}
          style={styles.gradient}
          start={{ x: 0.1, y: 0.2 }}
          end={{ x: 0.9, y: 0.8 }}
        />
        <CustomText text="MY_TRIP.FOOD_INFORMATION" style={styles.headerText} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.subtitleContainer}>
          <CustomIcon name={icons.card} size={spacing.Triple} color={colors.secondaryGreen} />
          <CustomText text="MY_TRIP.BUDGET_NOTES" style={styles.subtitle} />
        </View>
        <CustomText text={food.foodBudgetNotes} style={styles.contentValue} />
        <View style={styles.subtitleContainer}>
          <CustomIcon name={icons.info} size={spacing.Triple} color={colors.secondaryGreen} />
          <CustomText text="MY_TRIP.GENERAL_NOTES" style={styles.subtitle} />
        </View>
        <CustomText text={food.foodGeneralNotes} style={styles.contentValue} />
        <View style={styles.subtitleContainer}>
          <CustomIcon name={icons.cafe} size={spacing.Triple} color={colors.secondaryGreen} />
          <CustomText text="MY_TRIP.TYPICAL_DISHES" style={styles.subtitle} />
        </View>
        <FlatList
          data={dishItems}
          renderItem={({ item }) => <DishItem dish={item} />}
          keyExtractor={item => item.name}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.contentContainer}
          style={styles.list}
        />
        <CustomButtonSmall title="MY_TRIP.TYPICAL_DISHES_DETAILS" onPress={handleOpenModal} />
      </View>
    </View>
  );
};
