import type { Point } from 'react-native-google-places-autocomplete';

export interface LocationInfo {
  name: string;
  coordinates: Point | undefined;
  photoRef: string | undefined;
  url: string | undefined;
}
