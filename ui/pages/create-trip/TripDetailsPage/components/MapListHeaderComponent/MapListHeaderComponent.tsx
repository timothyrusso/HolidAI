import { PlatformOS } from '@/ui/constants/PlatformOS';
import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { Platform, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import type { AllCoordinates } from '../../TripDetailsPage.logic';
import { MapCallout } from '../MapCallout/MapCallout';
import { NumberedMarker } from '../NumberedMarker/NumberedMarker';
import { styles } from './MapListHeaderComponent.style';

type MapListHeaderComponentProps = {
  region: Region;
  allCoordinates: AllCoordinates[];
};

export const MapListHeaderComponent = ({ region, allCoordinates }: MapListHeaderComponentProps) => {
  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        provider={Platform.OS === PlatformOS.android ? PROVIDER_GOOGLE : undefined}
        region={region}
        loadingEnabled
        loadingBackgroundColor={colors.primaryGrey}
        loadingIndicatorColor={colors.primaryGrey}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
      >
        {/* Draw the route line */}
        <Polyline
          coordinates={allCoordinates.map(coord => ({
            latitude: coord.latitude,
            longitude: coord.longitude,
          }))}
          strokeColor={colors.primary}
          strokeWidth={spacing.MinimalDouble}
        />
        {allCoordinates.map((coord, index) => (
          <Marker
            key={`day${coord.day}-${coord.dayIndex}-${coord.scheduleIndex}-${coord.title}`}
            coordinate={{
              latitude: coord.latitude,
              longitude: coord.longitude,
            }}
            title={coord.title}
            description={coord.description}
          >
            <NumberedMarker number={index + 1} />
            <MapCallout coord={coord} />
          </Marker>
        ))}
      </MapView>
    </View>
  );
};
