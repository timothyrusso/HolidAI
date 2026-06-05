import { Badge, BaseSkeleton, BottomSheetHeader, CustomImage, CustomText, colors } from '@/features/core/ui';
import { IngredientsList } from '@/features/trips/ui/components/IngredientsList/IngredientsList';
import { useDishDetailsModalPageLogic } from '@/features/trips/ui/pages/DishDetailsModalPage/DishDetailsModalPage.logic';
import { styles } from '@/features/trips/ui/pages/DishDetailsModalPage/DishDetailsModalPage.style';
import { ScrollView, View } from 'react-native';

export const DishDetailsModalPage = () => {
  const {
    dishName,
    dishDescription,
    dishIngredients,
    handleClose,
    image,
    imageIsLoading,
    isVegetarian,
    isGlutenFree,
    isVegan,
    glutenFreeImage,
    veganImage,
    vegetarianImage,
  } = useDishDetailsModalPageLogic();

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
      <BottomSheetHeader title={dishName} onClose={handleClose} />
      <View style={styles.bodyContainer}>
        {imageIsLoading ? (
          <BaseSkeleton style={styles.image} />
        ) : (
          <CustomImage source={typeof image === 'string' ? { uri: image } : image} style={styles.image} />
        )}
        <IngredientsList title="MY_TRIP.INGREDIENTS" ingredients={dishIngredients} />
      </View>
      <CustomText text={dishDescription} style={styles.description} />
      <View style={styles.badgesContainer}>
        <Badge
          label="MY_TRIP.GLUTEN_FREE"
          image={glutenFreeImage}
          backgroundColor={colors.tertiaryGreen}
          active={isGlutenFree}
        />
        <Badge label="MY_TRIP.VEGAN" image={veganImage} backgroundColor={colors.tertiaryGreen} active={isVegan} />
        <Badge
          label="MY_TRIP.VEGETARIAN"
          image={vegetarianImage}
          backgroundColor={colors.tertiaryGreen}
          active={isVegetarian}
        />
      </View>
    </ScrollView>
  );
};
