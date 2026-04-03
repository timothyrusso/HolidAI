export type UnsplashPhotoDTO = {
  urls: { full: string; regular: string; small: string; thumb: string };
  blur_hash: string | null;
};

export type UnsplashSearchResponseDTO = {
  results: UnsplashPhotoDTO[];
};
