import { CustomIcon, CustomImage, CustomText, colors, icons, spacing } from '@/features/core/ui';
import type { Trip } from '@/features/trips/domain/entities/Trip';
import { useTripCardLogic } from '@/features/trips/ui/components/TripCard/TripCard.logic';
import { styles } from '@/features/trips/ui/components/TripCard/TripCard.style';
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
