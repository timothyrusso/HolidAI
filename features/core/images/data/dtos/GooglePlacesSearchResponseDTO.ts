import { Schema } from 'effect';

export const GooglePlacePhotoDTO = Schema.Struct({ name: Schema.String });
export type GooglePlacePhotoDTO = typeof GooglePlacePhotoDTO.Type;

export const GooglePlaceDTO = Schema.Struct({
  id: Schema.String,
  photos: Schema.optional(Schema.Array(GooglePlacePhotoDTO)),
});
export type GooglePlaceDTO = typeof GooglePlaceDTO.Type;

export const GooglePlacesSearchResponseDTO = Schema.Struct({
  places: Schema.optional(Schema.Array(GooglePlaceDTO)),
});
export type GooglePlacesSearchResponseDTO = typeof GooglePlacesSearchResponseDTO.Type;
