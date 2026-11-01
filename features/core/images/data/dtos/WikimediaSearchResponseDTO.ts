import { Schema } from 'effect';

const MetadataValue = Schema.Struct({ value: Schema.String });

export const WikimediaExtMetadataDTO = Schema.Struct({
  Restrictions: Schema.optional(MetadataValue),
  DeletionReason: Schema.optional(MetadataValue),
});
export type WikimediaExtMetadataDTO = typeof WikimediaExtMetadataDTO.Type;

export const WikimediaImageInfoDTO = Schema.Struct({
  thumburl: Schema.String,
  width: Schema.Number,
  height: Schema.Number,
  extmetadata: Schema.optional(WikimediaExtMetadataDTO),
});
export type WikimediaImageInfoDTO = typeof WikimediaImageInfoDTO.Type;

export const WikimediaCategoryDTO = Schema.Struct({ title: Schema.String });
export type WikimediaCategoryDTO = typeof WikimediaCategoryDTO.Type;

export const WikimediaPageDTO = Schema.Struct({
  pageid: Schema.Number,
  title: Schema.String,
  categories: Schema.optional(Schema.Array(WikimediaCategoryDTO)),
  imageinfo: Schema.optional(Schema.Array(WikimediaImageInfoDTO)),
});
export type WikimediaPageDTO = typeof WikimediaPageDTO.Type;

export const WikimediaSearchResponseDTO = Schema.Struct({
  query: Schema.optional(
    Schema.Struct({ pages: Schema.optional(Schema.Record({ key: Schema.String, value: WikimediaPageDTO })) }),
  ),
});
export type WikimediaSearchResponseDTO = typeof WikimediaSearchResponseDTO.Type;
