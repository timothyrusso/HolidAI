import { Routes } from '@/modules/navigation/domain/entities/routes';
import type { TravelerInfoMap } from '@/modules/trips/domain/entities/TravelerInfoMap';
import { CardType } from '@/ui/components/basic/CustomCard/CustomCard.logic';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { CustomIconTextCard } from '@/ui/components/composite/CustomIconTextCard/CustomIconTextCard';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { colors } from '@/ui/style/colors';
import { FlatList, View } from 'react-native';
import { useSelectTravelersPageLogic } from './SelectTravelersPage.logic';
import { style } from './SelectTravelersPage.style';
import { TravelersNumberSelector } from './components/TravelersNumberSelector/TravelersNumberSelector';

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
      <CustomText text="SELECT_TRAVELERS.TRAVELERS_NUMBER" style={style.subtitle} />
      <TravelersNumberSelector />
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
