/** A point on the map, as the places search returns it. */
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationInfo {
  name: string;
  coordinates: Coordinates | undefined;
  photoRef: string | undefined;
  url: string | undefined;
}
