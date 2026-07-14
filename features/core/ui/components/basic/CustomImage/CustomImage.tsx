import { Image } from 'expo-image';
import type { FC } from 'react';
import { BaseSkeleton } from '@/features/core/ui/components/basic/BaseSkeleton/BaseSkeleton';
import {
  type CustomImageProps,
  useCustomImageLogic,
} from '@/features/core/ui/components/basic/CustomImage/CustomImage.logic';

export const CustomImage: FC<CustomImageProps> = ({
  useBlur,
  blurhash,
  placeholder,
  source,
  isLoading = false,
  style,
  fallbackImage,
  onError,
  ...props
}) => {
  const {
    resolvedPlaceholder,
    resolvedSource,
    onError: handleError,
  } = useCustomImageLogic({
    useBlur,
    blurhash,
    placeholder,
    source,
    fallbackImage,
    onError,
  });

  return isLoading ? (
    <BaseSkeleton style={style} />
  ) : (
    <Image
      placeholder={resolvedPlaceholder}
      transition={200}
      source={resolvedSource}
      onError={handleError}
      style={style}
      {...props}
    />
  );
};
