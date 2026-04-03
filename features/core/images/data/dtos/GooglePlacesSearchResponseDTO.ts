export type GooglePlacePhotoDTO = {
  name: string;
};

export type GooglePlaceDTO = {
  id: string;
  photos?: GooglePlacePhotoDTO[];
};

export type GooglePlacesSearchResponseDTO = {
  places?: GooglePlaceDTO[];
};
