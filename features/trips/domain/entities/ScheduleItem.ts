interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface ScheduleItem {
  placeNumberID: number;
  bestTimeToVisit: string;
  rating: number;
  ticketPricing: string | number;
  placeDetails: string;
  placeDetailsLongDescription: string;
  placeSecretsAndInsights: string;
  geoCoordinates: GeoCoordinates;
  placeName: string;
  activity: string;
}
