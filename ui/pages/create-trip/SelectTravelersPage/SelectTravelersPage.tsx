import type { TravelerInfoMap } from '@/modules/trip/domain/entities/TravelerInfoMap';
import { CardType } from '@/ui/components/basic/CustomCard/CustomCard.logic';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { CustomIconTextCard } from '@/ui/components/composite/CustomIconTextCard/CustomIconTextCard';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { Routes } from '@/ui/constants/navigation/routes';
import { colors } from '@/ui/constants/style/colors';
import { FlatList, View } from 'react-native';
import { useSelectTravelersPageLogic } from './SelectTravelersPage.logic';
import { style } from './SelectTravelersPage.style';
import { TravelersNumberSlider } from './components/TravelersNumberSlider/TravelersNumberSlider';

const separatorItem = () => <View style={style.separator} />;

const SelectTravelersPage = () => {
  const { TravelerData, handleCardPress, selectedTravelers, handleButtonPress } = useSelectTravelersPageLogic();

  const renderItem = ({ item }: { item: TravelerInfoMap }) =>
    item.id !== null ? (
      <CustomIconTextCard
        cardType={CardType.Secondary}
        label={item.title}
        icon={item.icon}
        style={style.twoColumnCard}
        selected={selectedTravelers === item.id}
        onPress={() => handleCardPress(item.id ?? 0)}
        iconColor={selectedTravelers === item.id ? colors.primaryWhite : colors.primaryBlack}
      />
    ) : null;

  return (
    <BasicView
      nameView={Routes.SelectTraveler}
      statusBarStyle="dark"
      bottomButtonTitle="SELECT_DATES.TITLE"
      bottomButtonPress={handleButtonPress}
    >
      <CustomText text="SELECT_TRAVELERS.DESCRIPTION" style={style.subtitle} />
      <TravelersNumberSlider />
      <FlatList
        data={TravelerData}
        numColumns={2}
        keyExtractor={item => item.id?.toString() ?? ''}
        ItemSeparatorComponent={separatorItem}
        renderItem={renderItem}
        style={style.list}
        contentContainerStyle={style.contentContainer}
        columnWrapperStyle={style.columnWrapper}
        ListHeaderComponent={<CustomText text="SELECT_TRAVELERS.TRAVELERS_TYPE" style={style.listTitle} />}
      />
    </BasicView>
  );
};

export default SelectTravelersPage;
