import { Routes } from '@/features/core/navigation';
import { BasicView, CardType, CustomIconTextCard, CustomText, colors } from '@/features/core/ui';
import { TravelersNumberSelector } from '@/features/trip-generation/ui/components/TravelersNumberSelector/TravelersNumberSelector';
import { useSelectTravelersPageLogic } from '@/features/trip-generation/ui/pages/SelectTravelersPage/SelectTravelersPage.logic';
import { style } from '@/features/trip-generation/ui/pages/SelectTravelersPage/SelectTravelersPage.style';
import { FlatList, View } from 'react-native';

const SeparatorItem = () => <View style={style.separator} />;

export const SelectTravelersPage = () => {
  const { TravelerData, handleCardPress, selectedTravelers, handleButtonPress } = useSelectTravelersPageLogic();

  const renderItem = ({ item }: { item: (typeof TravelerData)[number] }) =>
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
        ItemSeparatorComponent={SeparatorItem}
        renderItem={renderItem}
        style={style.list}
        contentContainerStyle={style.contentContainer}
        columnWrapperStyle={style.columnWrapper}
        ListHeaderComponent={<CustomText text="SELECT_TRAVELERS.TRAVELERS_TYPE" style={style.listTitle} />}
      />
    </BasicView>
  );
};
