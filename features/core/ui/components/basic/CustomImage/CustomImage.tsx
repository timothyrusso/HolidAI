import { DEFAULT_BLURHASH } from '@/features/core/ui/style/blur';
import { Image, type ImageProps } from 'expo-image';
import type { FC } from 'react';
import { useState } from 'react';

const errorFallback = require('@/features/core/ui/assets/images/no-image-placeholder.jpg');

type CustomImageProps = ImageProps & {
  useBlur?: boolean;
  blurhash?: string;
};

export const CustomImage: FC<CustomImageProps> = ({
  useBlur = true,
  blurhash = DEFAULT_BLURHASH,
  placeholder,
  source,
  ...props
}) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const resolvedPlaceholder = placeholder ?? (useBlur ? { blurhash } : undefined);

  return (
    <Image
      placeholder={resolvedPlaceholder}
      transition={200}
      source={hasError || !source ? errorFallback : source}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};
