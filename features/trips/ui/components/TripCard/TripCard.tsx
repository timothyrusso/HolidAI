import type { Trip } from '@/features/trips/ui/components/TripCard/TripCard.logic';
import { useTripCardLogic } from '@/features/trips/ui/components/TripCard/TripCard.logic';
import { styles } from '@/features/trips/ui/components/TripCard/TripCard.style';
import { CustomIcon } from '@/ui/components/basic/CustomIcon/CustomIcon';
import { CustomImage } from '@/ui/components/basic/CustomImage/CustomImage';
import { CustomText } from '@/ui/components/basic/CustomText/CustomText';
import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { icons } from '@/ui/style/icons';
import { Pressable, View } from 'react-native';

export const TripCard = ({ item }: { item: Trip }) => {
  const { imageUrl, imageBlurHash, location, onCardPress, isFavorite } = useTripCardLogic(item);

  return (
    <Pressable style={({ pressed }) => [styles.container, pressed ? styles.pressed : {}]} onPress={onCardPress}>
      <CustomImage
        source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
        style={styles.image}
        placeholder={imageBlurHash ? { blurhash: imageBlurHash } : undefined}
      />
      <View style={styles.iconContainer}>
        <CustomIcon
          name={isFavorite ? icons.heartOutline : icons.hearth}
          size={spacing.TripleAndHalf}
          color={colors.primaryBlack}
        />
      </View>
      <CustomText text={location} style={styles.title} />
    </Pressable>
  );
};
