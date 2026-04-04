import type { UrlType } from '@/features/core/images/domain/entities/UrlType';

export type ImageFetchOptions = {
  urlType?: UrlType;
  maxWidthPx?: number;
};
