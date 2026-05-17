import { DEFAULT_BLURHASH } from '@/features/core/ui/style/blur';
import { Image, type ImageProps } from 'expo-image';
import type { FC } from 'react';

type CustomImageProps = ImageProps & {
  useBlur?: boolean;
  blurhash?: string;
};

export const CustomImage: FC<CustomImageProps> = ({
  useBlur = true,
  blurhash = DEFAULT_BLURHASH,
  placeholder,
  ...props
}) => {
  const resolvedPlaceholder = placeholder ?? (useBlur ? { blurhash } : undefined);

  return <Image placeholder={resolvedPlaceholder} transition={200} {...props} />;
};
