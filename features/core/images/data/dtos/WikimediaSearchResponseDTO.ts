export type WikimediaExtMetadataDTO = {
  Restrictions?: { value: string };
  DeletionReason?: { value: string };
};

export type WikimediaImageInfoDTO = {
  thumburl: string;
  width: number;
  height: number;
  extmetadata?: WikimediaExtMetadataDTO;
};

export type WikimediaCategoryDTO = {
  title: string;
};

export type WikimediaPageDTO = {
  pageid: number;
  title: string;
  categories?: WikimediaCategoryDTO[];
  imageinfo?: WikimediaImageInfoDTO[];
};

export type WikimediaSearchResponseDTO = {
  query?: {
    pages?: Record<string, WikimediaPageDTO>;
  };
};
