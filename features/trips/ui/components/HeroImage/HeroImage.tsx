import { CustomImage, PlatformOS } from '@/features/core/ui';
import { styles } from '@/features/trips/ui/components/HeroImage/HeroImage.style';
import { BlurTargetView } from 'expo-blur';
import type { FC, RefObject } from 'react';
import { Platform, type View } from 'react-native';

type HeroImageProps = {
  image: string | number | undefined;
  imageBlurHash: string | undefined;
  blurTargetRef: RefObject<View | null>;
};

export const HeroImage: FC<HeroImageProps> = ({ image, imageBlurHash, blurTargetRef }) => {
  const source = typeof image === 'string' ? { uri: image } : image;
  const placeholder = imageBlurHash ? { blurhash: imageBlurHash } : undefined;

  if (Platform.OS === PlatformOS.android) {
    return (
      <BlurTargetView ref={blurTargetRef} style={styles.image}>
        <CustomImage source={source} style={styles.image} placeholder={placeholder} />
      </BlurTargetView>
    );
  }

  return <CustomImage source={source} style={styles.image} placeholder={placeholder} />;
};
