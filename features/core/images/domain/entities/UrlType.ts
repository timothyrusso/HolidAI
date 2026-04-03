export const UrlType = {
  FULL: 'full',
  REGULAR: 'regular',
  SMALL: 'small',
  THUMB: 'thumb',
} as const;

export type UrlType = (typeof UrlType)[keyof typeof UrlType];
