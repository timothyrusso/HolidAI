import { Linking, Platform } from 'react-native';

export const useMapCalloutLogic = () => {
  const handleOpenMaps = (latitude: number, longitude: number, title: string) => {
    const scheme = Platform.select({
      ios: 'maps:',
      android: 'geo:',
    });
    const url = Platform.select({
      ios: `${scheme}?q=${title}&ll=${latitude},${longitude}`,
      android: `${scheme}?q=${latitude},${longitude}(${title})`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  return {
    handleOpenMaps,
  };
};
