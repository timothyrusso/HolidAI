import { CardType } from '@/ui/components/basic/CustomCard/CustomCard.logic';
import { CustomNumberButton } from '@/ui/components/composite/CustomNumberButton/CustomNumberButton';
import { FlatList, View } from 'react-native';
import { useTravelersNumberSelectorLogic } from './TravelersNumberSelector.logic';
import { styles } from './TravelersNumberSelector.style';

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
