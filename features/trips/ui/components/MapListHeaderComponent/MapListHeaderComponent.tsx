import { MapCallout } from '@/features/trips/ui/components/MapCallout/MapCallout';
import { styles } from '@/features/trips/ui/components/MapListHeaderComponent/MapListHeaderComponent.style';
import { NumberedMarker } from '@/features/trips/ui/components/NumberedMarker/NumberedMarker';
import type { AllCoordinates } from '@/features/trips/ui/pages/TripDetailsPage/TripDetailsPage.logic';
import { PlatformOS } from '@/ui/PlatformOS';
import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { Platform, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, type Region } from 'react-native-maps';

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
