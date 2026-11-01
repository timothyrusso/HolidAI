import { FlatList, View } from 'react-native';
import { CardType, CustomNumberButton } from '@/features/core/design-system';
import { useTravelersNumberSelectorLogic } from '@/features/trip-generation/ui/components/TravelersNumberSelector/TravelersNumberSelector.logic';
import { styles } from '@/features/trip-generation/ui/components/TravelersNumberSelector/TravelersNumberSelector.style';

const Separator = () => <View style={styles.separator} />;

export const TravelersNumberSelector = () => {
  const { state, derived } = useTravelersNumberSelectorLogic();

  const renderItem = ({ item }: { item: (typeof derived.options)[number] }) => (
    <CustomNumberButton
      cardType={CardType.Secondary}
      label={item.value.toString()}
      selected={state.travelersNumber === item.value}
      onPress={item.onPress}
    />
  );

  return (
    <FlatList
      data={derived.options}
      renderItem={renderItem}
      keyExtractor={item => item.value.toString()}
      showsHorizontalScrollIndicator={false}
      horizontal
      ItemSeparatorComponent={Separator}
      style={styles.list}
    />
  );
};
