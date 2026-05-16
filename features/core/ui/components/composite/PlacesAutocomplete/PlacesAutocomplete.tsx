import type { LocationInfo } from '@/features/core/ui/components/composite/PlacesAutocomplete/PlacesAutocomplete.logic';
import { usePlacesAutocompleteLogic } from '@/features/core/ui/components/composite/PlacesAutocomplete/PlacesAutocomplete.logic';
import { colors } from '@/features/core/ui/style/colors';
import { spacing } from '@/features/core/ui/style/dimensions/spacing';
import Constants from 'expo-constants';
import type { FC } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

type PlacesAutocompleteProps = {
  onPress: (locationInfo: LocationInfo) => void;
  placeholder?: string;
};

export const PlacesAutocomplete: FC<PlacesAutocompleteProps> = ({
  onPress,
  placeholder = 'SEARCH_PLACE_PAGE.SEARCH_PLACE',
}) => {
  const { translatedPlaceholder, language, handleFail, handleTimeout } = usePlacesAutocompleteLogic(placeholder);

  return (
    <GooglePlacesAutocomplete
      placeholder={translatedPlaceholder}
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
        language,
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
      onFail={handleFail}
      onTimeout={handleTimeout}
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
      predefinedPlaces={[]}
      predefinedPlacesAlwaysVisible={false}
      suppressDefaultStyles={false}
      textInputHide={false}
      textInputProps={{ placeholderTextColor: colors.primaryGrey }}
      timeout={20000}
    />
  );
};
