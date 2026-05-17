import { Routes } from '@/features/core/navigation';
import { BasicView, CustomText, LottieAnimation, PlacesAutocomplete } from '@/features/core/ui';
import { useSearchPageLogic } from '@/features/trip-generation/ui/pages/SearchPlacePage/SearchPlacePage.logic';
import { styles } from '@/features/trip-generation/ui/pages/SearchPlacePage/SearchPlacePage.style';
import { View } from 'react-native';

export const SearchPlacePage = () => {
  const { handleSearchPress, animation, handleParticipantsPress, isButtonDisabled } = useSearchPageLogic();

  return (
    <BasicView
      nameView={Routes.Search}
      statusBarStyle="dark"
      bottomButtonTitle="SELECT_TRAVELERS.TITLE"
      bottomButtonPress={handleParticipantsPress}
      bottomButtonDisabled={isButtonDisabled}
    >
      <CustomText text="SEARCH_PLACE_PAGE.DESCRIPTION" style={styles.subtitle} />
      <View style={styles.searchContainer}>
        <View style={styles.autoCompleteContainer}>
          <PlacesAutocomplete onPress={handleSearchPress} />
        </View>
        <View style={styles.animationContainer}>
          <LottieAnimation style={styles.animation} animationPath={animation} loop={false} />
        </View>
      </View>
    </BasicView>
  );
};
