import { useActivityImageCarouselLogic } from '@/features/trips/ui/pages/ActivityDetailsPage/components/ActivityImageCarousel/ActivityImageCarousel.logic';
import { styles } from '@/features/trips/ui/pages/ActivityDetailsPage/components/ActivityImageCarousel/ActivityImageCarousel.style';
import { BaseSkeleton } from '@/ui/components/basic/BaseSkeleton/BaseSkeleton';
import { CustomImage } from '@/ui/components/basic/CustomImage/CustomImage';
import { FlatList, ScrollView } from 'react-native';

const SKELETON_COUNT = 5;

type Props = {
  imageLocationName: string;
};

export const ActivityImageCarousel = ({ imageLocationName }: Props) => {
  const { images, isLoading, shouldShow } = useActivityImageCarouselLogic(imageLocationName);

  if (!shouldShow) return null;

  if (isLoading) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <BaseSkeleton key={String(i)} style={styles.image} />
        ))}
      </ScrollView>
    );
  }

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={images}
      keyExtractor={item => String(item.url)}
      renderItem={({ item }) => <CustomImage source={item.url} style={styles.image} />}
      contentContainerStyle={styles.contentContainer}
    />
  );
};
