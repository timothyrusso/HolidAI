import type { Food } from '@/modules/trips/domain/dto/UserTripsDTO';
import { CustomIcon } from '@/ui/components/basic/CustomIcon/CustomIcon';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { icons } from '@/ui/style/icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { FC } from 'react';
import { FlatList, View } from 'react-native';
import { styles } from './FoodCard.style';

type FoodCardProps = {
  food: Food;
};

export const FoodCard: FC<FoodCardProps> = ({ food }) => {
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
          data={food.typicalDishes}
          renderItem={({ item }) => (
            <CustomText text={item} style={styles.foodItem} numberOfLines={1} ellipsizeMode="tail" />
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.contentContainer}
          style={styles.list}
        />
      </View>
    </View>
  );
};
