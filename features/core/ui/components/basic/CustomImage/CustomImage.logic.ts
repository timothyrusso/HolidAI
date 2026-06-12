import { DEFAULT_BLURHASH } from '@/features/core/ui/style/blur';
import type { ImageProps } from 'expo-image';
import { useState } from 'react';

const errorFallback = require('@/features/core/ui/assets/images/no-image-placeholder.jpg');

export type CustomImageProps = Omit<ImageProps, 'onError'> & {
  useBlur?: boolean;
  blurhash?: string;
  isLoading?: boolean;
  fallbackImage?: number | { uri: string };
  onError?: (failedUri: string) => void;
};

export const useCustomImageLogic = ({
  useBlur = true,
  blurhash = DEFAULT_BLURHASH,
  placeholder,
  source,
  fallbackImage = errorFallback,
  onError: customOnError,
}: Pick<CustomImageProps, 'useBlur' | 'blurhash' | 'placeholder' | 'source' | 'fallbackImage' | 'onError'>) => {
  const [erroredUri, setErroredUri] = useState<string | null>(null);

  const resolvedPlaceholder = placeholder ?? (useBlur ? { blurhash } : undefined);
  const uri = typeof source === 'object' && source !== null && 'uri' in source ? (source as { uri: string }).uri : null;
  const hasError = uri !== null && uri === erroredUri;

  const onError = () => {
    setErroredUri(uri);
    if (uri) customOnError?.(uri);
  };

  return {
    resolvedPlaceholder,
    resolvedSource: hasError || !source ? fallbackImage : source,
    onError,
  };
};
