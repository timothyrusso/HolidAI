import type { FC, ReactElement } from 'react';
import { Animated, Image, View, type ViewStyle } from 'react-native';

import { images } from '@/ui/constants/style/dimensions/images';

import { BaseSkeleton } from '../../basic/BaseSkeleton/BaseSkeleton';
import CustomText from '../../basic/CustomText/CustomText';
import { style } from './AnimatedHeaderImage.style';

interface AnimatedHeaderImageProps {
  value: Animated.Value;
  title?: string;
  imageUrl?: string;
  chips?: ReactElement;
  isLoading?: boolean;
  headerIcons?: ReactElement;
  chipsAlignment?: ViewStyle['justifyContent'];
}

const AnimatedHeaderImage: FC<AnimatedHeaderImageProps> = ({
  value,
  imageUrl,
  title,
  chips,
  isLoading,
  headerIcons,
  chipsAlignment = 'space-between',
}) => {
  const HEADER_MAX_HEIGHT = images.fullScreenImageHeight;
  const HEADER_MIN_HEIGHT = images.fullScreenMinImageHeight;
  const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const animatedHeaderHeight = value.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const animatedOpacity = value.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const styles = style(chipsAlignment, animatedHeaderHeight, animatedOpacity);

  return isLoading ? (
    <BaseSkeleton style={styles.imageSkeleton} />
  ) : (
    <Animated.View style={styles.header}>
      <Animated.View style={styles.titleContainer}>
        <View style={styles.chipsContainer}>
          {title && (
            <CustomText text={title.toUpperCase()} style={styles.title} numberOfLines={2} ellipsizeMode="tail" />
          )}
          <View style={styles.detailsChipRow}>{chips}</View>
        </View>
      </Animated.View>
      <View style={styles.image}>
        {imageUrl && (
          <Image source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl} style={styles.image} />
        )}
      </View>
      {headerIcons && <View style={styles.iconsContainer}>{headerIcons}</View>}
    </Animated.View>
  );
};

export default AnimatedHeaderImage;
