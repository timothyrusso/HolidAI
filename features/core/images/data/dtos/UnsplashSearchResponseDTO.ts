import { Schema } from 'effect';

export const UnsplashPhotoDTO = Schema.Struct({
  urls: Schema.Struct({ full: Schema.String, regular: Schema.String, small: Schema.String, thumb: Schema.String }),
  blur_hash: Schema.NullOr(Schema.String),
});
export type UnsplashPhotoDTO = typeof UnsplashPhotoDTO.Type;

export const UnsplashSearchResponseDTO = Schema.Struct({
  results: Schema.Array(UnsplashPhotoDTO),
});
export type UnsplashSearchResponseDTO = typeof UnsplashSearchResponseDTO.Type;
