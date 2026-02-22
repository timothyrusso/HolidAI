import { CardType } from '@/ui/components/basic/CustomCard/CustomCard.logic';
import { CustomNumberButton } from '@/ui/components/composite/CustomNumberButton/CustomNumberButton';
import { FlatList, View } from 'react-native';
import { useTravelersNumberSelectorLogic } from './TravelersNumberSelector.logic';
import { styles } from './TravelersNumberSelector.style';

export const TravelersNumberSelector = () => {
  const { handleCardPress, travelersNumber, data } = useTravelersNumberSelectorLogic();

  const renderItem = ({ item }: { item: number }) =>
    item !== null ? (
      <CustomNumberButton
        cardType={CardType.Secondary}
        label={item.toString()}
        selected={travelersNumber === item}
        onPress={() => handleCardPress(item ?? 0)}
      />
    ) : null;

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.toString()}
      showsVerticalScrollIndicator={false}
      horizontal
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      style={styles.list}
    />
  );
};
