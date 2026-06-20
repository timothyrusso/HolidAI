export const buildGooglePlacesMediaUrl = (resourceName: string, apiKey: string, maxWidthPx: number): string =>
  `https://places.googleapis.com/v1/${resourceName}/media?key=${apiKey}&maxWidthPx=${maxWidthPx}`;
