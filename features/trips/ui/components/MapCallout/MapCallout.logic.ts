import { showLocation } from 'react-native-map-link';

export const useMapCalloutLogic = () => {
  const handleOpenMaps = (latitude: number, longitude: number, title: string) => {
    showLocation({ latitude, longitude, title });
  };

  return {
    handleOpenMaps,
  };
};
