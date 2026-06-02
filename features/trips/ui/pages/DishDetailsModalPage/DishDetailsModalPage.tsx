import { BaseSkeleton, BottomSheetHeader, CustomImage, CustomText } from '@/features/core/ui';
import { useDishDetailsModalPageLogic } from '@/features/trips/ui/pages/DishDetailsModalPage/DishDetailsModalPage.logic';
import { styles } from '@/features/trips/ui/pages/DishDetailsModalPage/DishDetailsModalPage.style';
import { ScrollView, View } from 'react-native';

export const DishDetailsModalPage = () => {
  const { dishName, dishDescription, handleClose, image, imageIsLoading } = useDishDetailsModalPageLogic();

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
      <BottomSheetHeader title={dishName} onClose={handleClose} />
      <View style={styles.bodyContainer}>
        <View style={styles.imageWrapper}>
          {imageIsLoading ? (
            <BaseSkeleton style={styles.image} />
          ) : (
            <CustomImage source={typeof image === 'string' ? { uri: image } : image} style={styles.image} />
          )}
        </View>
        <CustomText text={dishDescription} style={styles.description} />
      </View>
    </ScrollView>
  );
};
