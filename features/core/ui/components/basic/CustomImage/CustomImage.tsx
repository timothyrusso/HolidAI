import { BaseSkeleton } from '@/features/core/ui/components/basic/BaseSkeleton/BaseSkeleton';
import { DEFAULT_BLURHASH } from '@/features/core/ui/style/blur';
import { Image, type ImageProps } from 'expo-image';
import type { FC } from 'react';
import { useState } from 'react';

const errorFallback = require('@/features/core/ui/assets/images/no-image-placeholder.jpg');

type CustomImageProps = ImageProps & {
  useBlur?: boolean;
  blurhash?: string;
  isLoading?: boolean;
  fallbackImage?: number | { uri: string };
  onError?: () => void;
};

export const CustomImage: FC<CustomImageProps> = ({
  useBlur = true,
  blurhash = DEFAULT_BLURHASH,
  placeholder,
  source,
  isLoading = false,
  style,
  fallbackImage = errorFallback,
  onError: customOnError,
  ...props
}) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const resolvedPlaceholder = placeholder ?? (useBlur ? { blurhash } : undefined);

  const onError = () => {
    setHasError(true);
  };

  return isLoading ? (
    <BaseSkeleton style={style} />
  ) : (
    <Image
      placeholder={resolvedPlaceholder}
      transition={200}
      source={hasError || !source ? fallbackImage : source}
      onError={customOnError ?? onError}
      style={style}
      {...props}
    />
  );
};
