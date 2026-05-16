import { CardType, CustomNumberButton } from '@/features/core/ui';
import { useTravelersNumberSelectorLogic } from '@/features/trip-generation/ui/components/TravelersNumberSelector/TravelersNumberSelector.logic';
import { styles } from '@/features/trip-generation/ui/components/TravelersNumberSelector/TravelersNumberSelector.style';
import { FlatList, View } from 'react-native';

const Separator = () => <View style={styles.separator} />;

export const TravelersNumberSelector = () => {
  const { handleCardPress, travelersNumber, data } = useTravelersNumberSelectorLogic();

  const renderItem = ({ item }: { item: number }) => (
    <CustomNumberButton
      cardType={CardType.Secondary}
      label={item.toString()}
      selected={travelersNumber === item}
      onPress={() => handleCardPress(item)}
    />
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.toString()}
      showsHorizontalScrollIndicator={false}
      horizontal
      ItemSeparatorComponent={Separator}
      style={styles.list}
    />
  );
};
