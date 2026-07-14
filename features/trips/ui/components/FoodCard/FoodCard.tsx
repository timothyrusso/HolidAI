import { LinearGradient } from 'expo-linear-gradient';
import type { FC } from 'react';
import { Pressable, View } from 'react-native';
import { CustomIcon, CustomText, colors, icons, spacing } from '@/features/core/ui';
import type { Food } from '@/features/trips/domain/entities/Food';
import { useFoodCardLogic } from '@/features/trips/ui/components/FoodCard/FoodCard.logic';
import { styles } from '@/features/trips/ui/components/FoodCard/FoodCard.style';

type FoodCardProps = {
  food: Food;
  tripId: string;
};

export const FoodCard: FC<FoodCardProps> = ({ food, tripId }) => {
  const { handleOpenModal } = useFoodCardLogic(tripId);

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
        <Pressable
          style={({ pressed }) => [styles.typicalDishesBox, pressed && styles.pressed]}
          onPress={handleOpenModal}
        >
          <View style={styles.titleContainer}>
            <CustomIcon name={icons.cafe} size={spacing.Triple} color={colors.secondaryGreen} />
            <CustomText text="MY_TRIP.TYPICAL_DISHES" style={styles.boxText} />
          </View>
          <CustomText text="MY_TRIP.MORE_DETAILS" style={styles.boxButton} />
        </Pressable>
      </View>
    </View>
  );
};
