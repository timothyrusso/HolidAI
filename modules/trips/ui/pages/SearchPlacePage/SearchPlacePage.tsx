import { Routes } from '@/modules/navigation/domain/entities/routes';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import LottieAnimation from '@/ui/components/basic/LottieAnimation/LottieAnimation';
import PlacesAutocomplete from '@/ui/components/composite/PlacesAutocomplete/PlacesAutocomplete';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { View } from 'react-native';
import { useSearchPageLogic } from './SearchPlacePage.logic';
import { styles } from './SearchPlacePage.style';

const SearchPlacePage = () => {
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

export default SearchPlacePage;
