import { logger } from '@/di/resolve';
import { AppKeys } from '@/modules/shared/domain/AppKeys';
import type { LocationInfo } from '@/modules/trip/domain/entities/LocationInfo';
import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import Constants from 'expo-constants';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

type PlacesAutocompleteProps = {
  onPress: (locationInfo: LocationInfo) => void;
  placeholder?: string;
};
const PlacesAutocomplete: FC<PlacesAutocompleteProps> = ({
  onPress,
  placeholder = 'SEARCH_PLACE_PAGE.SEARCH_PLACE',
}) => {
  const { i18n, t } = useTranslation();
  const getLanguage = () => i18n.language;

  return (
    <GooglePlacesAutocomplete
      placeholder={t(placeholder)}
      fetchDetails={true}
      onPress={(data, details = null) => {
        onPress({
          name: data.description,
          coordinates: details?.geometry.location,
          // @ts-ignore
          photoRef: details?.photos?.[0].photo_reference,
          url: details?.url,
        });
      }}
      query={{
        key: Constants.expoConfig?.extra?.googlePlacesApiKey,
        language: getLanguage ?? AppKeys.defaultLanguage,
        types: 'geocode',
      }}
      styles={{
        textInputContainer: {
          height: spacing.separator40 + spacing.Single,
          borderWidth: spacing.Minimal,
          borderColor: colors.primaryBlack,
          borderRadius: spacing.Triple,
          overflow: 'hidden',
          backgroundColor: colors.primaryWhite,
        },
      }}
      onFail={logger.error}
      autoFillOnNotFound={false}
      currentLocation={false}
      currentLocationLabel="Current location"
      debounce={0}
      disableScroll={false}
      enableHighAccuracyLocation={true}
      enablePoweredByContainer={true}
      filterReverseGeocodingByTypes={[]}
      GooglePlacesDetailsQuery={{}}
      GooglePlacesSearchQuery={{
        rankby: 'distance',
        type: 'restaurant',
      }}
      GoogleReverseGeocodingQuery={{}}
      isRowScrollable={true}
      keyboardShouldPersistTaps="always"
      listUnderlayColor="#c8c7cc"
      listViewDisplayed="auto"
      keepResultsAfterBlur={false}
      minLength={1}
      nearbyPlacesAPI="GooglePlacesSearch"
      numberOfLines={1}
      onNotFound={() => {}}
      onTimeout={() => console.warn('google places autocomplete: request timeout')}
      predefinedPlaces={[]}
      predefinedPlacesAlwaysVisible={false}
      suppressDefaultStyles={false}
      textInputHide={false}
      textInputProps={{}}
      timeout={20000}
    />
  );
};

export default PlacesAutocomplete;
