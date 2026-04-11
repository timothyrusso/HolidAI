import CustomText from '@/ui/components/basic/CustomText/CustomText';
import type { FC } from 'react';
import { View } from 'react-native';
import { Callout } from 'react-native-maps';
import { useMapCalloutLogic } from './MapCallout.logic';
import { styles } from './MapCallout.style';

type MapCalloutProps = {
  coord: {
    latitude: number;
    longitude: number;
    title: string;
    description: string;
  };
};

export const MapCallout: FC<MapCalloutProps> = ({ coord }) => {
  const { handleOpenMaps } = useMapCalloutLogic();

  return (
    <Callout onPress={() => handleOpenMaps(coord.latitude, coord.longitude, coord.title)} style={styles.callout}>
      <View style={styles.calloutContent}>
        <CustomText text={coord.title} style={styles.calloutTitle} />
        <CustomText text={coord.description} style={styles.calloutDescription} />
        <CustomText text="TRIP_DETAILS.OPEN_IN_MAPS" style={styles.calloutButton} />
      </View>
    </Callout>
  );
};
