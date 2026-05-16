import { BaseSkeleton, CustomImage } from '@/features/core/ui';
import type { ImageResult } from '@/features/trips/ui/pages/ActivityDetailsPage/components/ActivityImageCarousel/ActivityImageCarousel.logic';
import { styles } from '@/features/trips/ui/pages/ActivityDetailsPage/components/ActivityImageCarousel/ActivityImageCarousel.style';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList } from 'react-native';

const MIN_IMAGES = 2;
const SKELETON_COUNT = 5;

type SkeletonItem = { uuid: string };
type CarouselItem = ImageResult | SkeletonItem;

const SKELETON_ITEMS: SkeletonItem[] = Array.from({ length: SKELETON_COUNT }, (_, i) => ({ uuid: String(i) }));

const renderItem = ({ item }: ListRenderItemInfo<CarouselItem>) => {
  if ('uuid' in item) return <BaseSkeleton style={styles.image} />;
  return <CustomImage source={item.url} style={styles.image} />;
};

type ActivityImageCarouselProps = {
  images: ImageResult[];
  isLoading: boolean;
};

export const ActivityImageCarousel = ({ images, isLoading }: ActivityImageCarouselProps) => {
  const shouldShow = isLoading || images.length >= MIN_IMAGES;

  if (!shouldShow) return null;

  return (
    <FlatList<CarouselItem>
      horizontal
      showsHorizontalScrollIndicator={false}
      data={isLoading ? SKELETON_ITEMS : images}
      keyExtractor={item => ('uuid' in item ? item.uuid : String(item.url))}
      renderItem={renderItem}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    />
  );
};
