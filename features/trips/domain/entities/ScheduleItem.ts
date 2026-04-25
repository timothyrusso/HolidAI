interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface ScheduleItem {
  placeNumberID: number;
  bestTimeToVisit: string;
  rating: number;
  ticketPricing: number | null;
  placeDetails: string;
  placeDetailsLongDescription: string;
  placeSecretsAndInsights: string;
  geoCoordinates: GeoCoordinates;
  placeName: string;
  activity: string;
}
