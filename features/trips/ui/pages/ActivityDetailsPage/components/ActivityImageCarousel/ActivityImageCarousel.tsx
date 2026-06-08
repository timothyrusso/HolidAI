import { CustomImage } from '@/features/core/ui';
import type { ImageResult } from '@/features/trips/ui/pages/ActivityDetailsPage/components/ActivityImageCarousel/ActivityImageCarousel.logic';
import { styles } from '@/features/trips/ui/pages/ActivityDetailsPage/components/ActivityImageCarousel/ActivityImageCarousel.style';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList } from 'react-native';

const MIN_IMAGES = 2;

const renderItem = ({ item }: ListRenderItemInfo<ImageResult>) => (
  <CustomImage source={item.url} style={styles.image} />
);

type ActivityImageCarouselProps = {
  images: ImageResult[];
};

export const ActivityImageCarousel = ({ images }: ActivityImageCarouselProps) => {
  if (images.length < MIN_IMAGES) return null;

  return (
    <FlatList<ImageResult>
      horizontal
      showsHorizontalScrollIndicator={false}
      data={images}
      keyExtractor={item => String(item.url)}
      renderItem={renderItem}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    />
  );
};
