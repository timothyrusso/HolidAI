import Constants from 'expo-constants';
import type { FC } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import type { LocationInfo } from '@/features/core/design-system/components/composite/PlacesAutocomplete/PlacesAutocomplete.logic';
import { usePlacesAutocompleteLogic } from '@/features/core/design-system/components/composite/PlacesAutocomplete/PlacesAutocomplete.logic';
import { colors } from '@/features/core/design-system/style/colors';
import { spacing } from '@/features/core/design-system/style/dimensions/spacing';

type PlacesAutocompleteProps = {
  onPress: (locationInfo: LocationInfo) => void;
  placeholder?: string;
};

export const PlacesAutocomplete: FC<PlacesAutocompleteProps> = ({
  onPress,
  placeholder = 'SEARCH_PLACE_PAGE.SEARCH_PLACE',
}) => {
  const { state, derived, effects } = usePlacesAutocompleteLogic(placeholder);

  return (
    <GooglePlacesAutocomplete
      placeholder={derived.translatedPlaceholder}
      fetchDetails={true}
      onPress={(data, details = null) => {
        onPress({
          name: data.description,
          coordinates: details?.geometry.location,
          // @ts-expect-error
          photoRef: details?.photos?.[0].photo_reference,
          url: details?.url,
        });
      }}
      query={{
        key: Constants.expoConfig?.extra?.googlePlacesApiKey,
        language: state.language,
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
      onFail={effects.handleFail}
      onTimeout={effects.handleTimeout}
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
      listUnderlayColor={colors.secondaryGrey}
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
